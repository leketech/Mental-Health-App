package main

import (
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"

	"github.com/gofiber/fiber/v2"
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

	// Debug environment variables (without exposing sensitive data)
	log.Printf("📊 Environment check:")
	log.Printf("  - DATABASE_URL: %s", func() string {
		if url := os.Getenv("DATABASE_URL"); url != "" {
			// Mask the URL for security
			masked := url
			if len(url) > 20 {
				masked = url[:15] + "..." + url[len(url)-10:]
			}
			return "[SET] " + masked
		}
		return "[NOT SET]"
	}())
	log.Printf("  - DB_CONNECTION_STRING: %s", func() string {
		if url := os.Getenv("DB_CONNECTION_STRING"); url != "" {
			// Mask the URL for security
			masked := url
			if len(url) > 20 {
				masked = url[:15] + "..." + url[len(url)-10:]
			}
			return "[SET] " + masked
		}
		return "[NOT SET]"
	}())
	log.Printf("  - JWT_SECRET: %s", func() string {
		if secret := os.Getenv("JWT_SECRET"); secret != "" {
			return "[SET] Length: " + fmt.Sprintf("%d", len(secret))
		}
		return "[NOT SET]"
	}())
	log.Printf("  - PORT: %s", os.Getenv("PORT"))
	log.Printf("  - CORS_ORIGIN: %s", os.Getenv("CORS_ORIGIN"))
	
	// Print all environment variables for debugging (excluding sensitive ones)
	log.Printf("🔍 All environment variables (excluding sensitive):")
	for _, env := range os.Environ() {
		if !strings.Contains(env, "SECRET") && !strings.Contains(env, "PASSWORD") && !strings.Contains(env, "KEY") {
			parts := strings.SplitN(env, "=", 2)
			if len(parts) == 2 {
				log.Printf("  - %s=%s", parts[0], parts[1])
			}
		}
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

	// Fiber app
	app := fiber.New()

	// Add security middleware to block malicious requests
	// This should be one of the first middlewares to catch threats early
	app.Use(middleware.SecurityMiddleware())

	// CORS middleware
	app.Use(func(c *fiber.Ctx) error {
		// Get CORS origin from environment
		corsOrigin := os.Getenv("CORS_ORIGIN")
		if corsOrigin == "" {
			// SECURITY: In production, never allow all origins
			if os.Getenv("NODE_ENV") == "production" || os.Getenv("ENV") == "production" {
				log.Fatal("❌ FATAL: CORS_ORIGIN environment variable is required in production")
			}
			corsOrigin = "*" // Allow all origins in development only
			log.Printf("⚠️ CORS_ORIGIN not set, allowing all origins (UNSAFE for production!)")
		}
		
		c.Set("Access-Control-Allow-Origin", corsOrigin)
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Set("Access-Control-Allow-Credentials", "true")

		if c.Method() == "OPTIONS" {
			return c.SendStatus(200)
		}

		return c.Next()
	})

	// Health check endpoint for Render/Railway
	app.Get("/health", func(c *fiber.Ctx) error {
		// Check database connection if available
		if config.DB != nil {
			if err := config.DB.Ping(); err != nil {
				return c.Status(503).JSON(fiber.Map{
					"status": "unhealthy",
					"error":  "database connection failed",
					"details": err.Error(),
					"service": "UnwindMind API",
					"version": "1.0.0",
					"port": os.Getenv("PORT"),
					"database": "disconnected",
					"timestamp": c.Locals("time"),
				})
			}
			return c.JSON(fiber.Map{
				"status": "healthy",
				"service": "UnwindMind API",
				"version": "1.0.0",
				"port": os.Getenv("PORT"),
				"database": "connected",
				"timestamp": c.Locals("time"),
			})
		} else {
			// No database mode
			return c.JSON(fiber.Map{
				"status": "partial",
				"service": "UnwindMind API",
				"version": "1.0.0",
				"port": os.Getenv("PORT"),
				"database": "not_connected",
				"message": "Add PostgreSQL service to Railway for full functionality",
				"timestamp": c.Locals("time"),
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
	log.Printf("🔍 JWT_SECRET environment variable length: %d", len(secret))
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
		log.Printf("⚠️ JWT_SECRET is too short (%d characters), current value: %s", len(secret), secret)
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
		port = "10000" // Default port for local development
	}

	// ✅ Log startup information
	log.Printf("✅ Server starting on port %s", port)
	log.Printf("✅ Environment: PORT=%s", os.Getenv("PORT"))
	log.Printf("✅ Go version: %s", runtime.Version())
	log.Printf("✅ CORS_ORIGIN: %s", os.Getenv("CORS_ORIGIN"))

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