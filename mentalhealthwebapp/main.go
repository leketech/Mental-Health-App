package main

import (
	"context"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"github.com/leketech/mental-health-app/config"
	"github.com/leketech/mental-health-app/middleware"
	"github.com/leketech/mental-health-app/routes"
)

func main() {
	// Log startup information
	log.Printf("✅ Starting UnwindMind API Server...")
	log.Printf("✅ Go version: %s", runtime.Version())

	// Detect environment
	env := os.Getenv("NODE_ENV")
	if env == "" {
		env = os.Getenv("ENV")
	}
	if env == "" {
		env = "development"
	}
	log.Printf("🌍 Environment: %s", env)

	// Load .env file ONLY if we're not in a Docker/production environment
	// This ensures Docker Compose environment variables take precedence
	if env != "production" && os.Getenv("DOCKER_ENV") != "true" {
		if err := godotenv.Load(); err != nil {
			log.Printf("⚠️ .env file not found, using system env")
		} else {
			log.Printf("✅ Loaded .env file")
		}
	} else {
		log.Printf("⏭️ Skipping .env file load in Docker/production environment")
	}

	// Connect to DB
	if err := config.ConnectDB(); err != nil {
		log.Printf("❌ Failed to connect to database: %v", err)
		log.Printf("⚠️ Running in NO-DATABASE mode for testing. Add PostgreSQL service to Railway for full functionality.")
		config.DB = nil // Set to nil to indicate no database
	} else {
		log.Printf("✅ Database connection successful")
		defer config.DB.Close()
	}

	// Fiber app with performance optimizations
	app := fiber.New(fiber.Config{
		Prefork:       false, // Disabled for containerized environments
		CaseSensitive: true,
		StrictRouting: true,
		ServerHeader:  "UnwindMind",
		AppName:       "UnwindMind API v1.0",
	})

	// Middleware for performance and security
	app.Use(recover.New())  // Recover from panics
	app.Use(compress.New()) // Compress responses
	app.Use(logger.New())   // Log requests

	// Serve frontend static files
	// In Docker, frontend build is copied to /root/frontend/build
	// In development, it's in ./frontend/build
	frontendPath := "./frontend/build"
	if _, err := os.Stat("/root/frontend/build"); err == nil {
		frontendPath = "/root/frontend/build"
	}

	// Create a custom handler for SPA routing
	app.Use(func(c *fiber.Ctx) error {
		// For API routes, continue to next handler
		if strings.HasPrefix(c.Path(), "/api/") {
			return c.Next()
		}

		// For health check, continue to next handler
		if c.Path() == "/health" {
			return c.Next()
		}

		// Try to serve the requested file
		filePath := filepath.Join(frontendPath, c.Path())

		// Check if file exists
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			// If file doesn't exist, serve index.html for SPA routing
			indexPath := filepath.Join(frontendPath, "index.html")
			return c.SendFile(indexPath)
		}

		// Serve the file if it exists
		return c.SendFile(filePath)
	})

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("CORS_ORIGIN"),
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
	}))

	// Health check endpoint for Render/Railway
	app.Get("/health", func(c *fiber.Ctx) error {
		// Check database connection if available
		if config.DB != nil {
			// Use context with timeout to prevent hanging
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			defer cancel()

			if err := config.DB.PingContext(ctx); err != nil {
				log.Printf("⚠️ Health check: database ping failed: %v", err)
				return c.Status(503).JSON(fiber.Map{
					"status":   "unhealthy",
					"error":    "database connection failed",
					"details":  err.Error(),
					"service":  "UnwindMind API",
					"version":  "1.0.0",
					"port":     os.Getenv("PORT"),
					"database": "disconnected",
				})
			}
			return c.JSON(fiber.Map{
				"status":   "healthy",
				"service":  "UnwindMind API",
				"version":  "1.0.0",
				"port":     os.Getenv("PORT"),
				"database": "connected",
			})
		} else {
			// No database mode
			return c.JSON(fiber.Map{
				"status":   "partial",
				"service":  "UnwindMind API",
				"version":  "1.0.0",
				"port":     os.Getenv("PORT"),
				"database": "not_connected",
				"message":  "Add PostgreSQL service to Railway for full functionality",
			})
		}
	})

	// Public routes (no authentication required)
	app.Post("/api/chat", routes.ChatHandler)
	app.Post("/api/login", routes.Login(config.DB))
	app.Post("/api/register", routes.Register(config.DB))
	app.Post("/api/refresh", routes.RefreshToken(config.DB))

	// JWT Middleware with blacklist checking
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// SECURITY: In production, this should never happen
		if os.Getenv("NODE_ENV") == "production" || os.Getenv("ENV") == "production" {
			log.Fatal("❌ FATAL: JWT_SECRET environment variable is required in production")
		}
		// #nosec G101 -- This is a development fallback, not production credentials
		// Generate a random secret for development/testing purposes
		secret = "development-jwt-secret-" + runtime.Version() + "-change-in-production-32-char-minimum"
		log.Printf("⚠️ JWT_SECRET not set, using development fallback (MUST set in production!)")
	}
	// Ensure minimum length for security
	if len(secret) < 32 {
		log.Printf("⚠️ JWT_SECRET is too short (%d characters)", len(secret))
		// For development, we'll pad the secret if it's too short
		if os.Getenv("NODE_ENV") != "production" && os.Getenv("ENV") != "production" {
			// Pad with a strong secret to meet minimum length requirement
			secret = "this-is-a-very-long-secret-key-for-development-use-only-change-in-production-and-must-be-at-least-32-characters"
			log.Printf("⚠️ JWT_SECRET was too short, replaced with proper length secret. New length: %d", len(secret))
		} else {
			log.Fatal("❌ FATAL: JWT_SECRET must be at least 32 characters long for security")
		}
	} else {
		log.Printf("✅ JWT_SECRET meets minimum length requirement (%d characters)", len(secret))
	}
	jwtMiddleware := middleware.JWTProtectedWithBlacklist(secret, config.DB)

	// Protected API routes (authentication required)
	api := app.Group("/api", jwtMiddleware)

	// Logout endpoint (requires authentication to blacklist current token)
	api.Post("/logout", routes.Logout(config.DB))

	// Mood endpoints
	api.Get("/moods", routes.GetMoods(config.DB))
	api.Post("/moods", routes.CreateMood(config.DB))

	// Journal endpoints
	api.Get("/journals", routes.GetJournals(config.DB))
	api.Post("/journals", routes.CreateJournal(config.DB))
	api.Put("/journals/:id", routes.UpdateJournal(config.DB))
	api.Delete("/journals/:id", routes.DeleteJournal(config.DB))

	// User endpoints
	api.Get("/user/profile", routes.GetUserProfile(config.DB))
	api.Get("/user/stats", routes.GetUserStats(config.DB))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port for production
	}

	// ✅ Bind to 0.0.0.0 for Render compatibility (not localhost)
	addr := "0.0.0.0:" + port
	log.Printf("✅ Binding to address: %s", addr)
	log.Printf("✅ Health check available at: %s/health", addr)

	// Start the server
	log.Printf("🚀 UnwindMind API Server starting...")
	if err := app.Listen(addr); err != nil {
		log.Fatalf("❌ Failed to start server on %s: %v", addr, err)
	}
}
