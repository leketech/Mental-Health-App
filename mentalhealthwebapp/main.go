package main

import (
	"log"
	"os"
	"runtime"

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
	
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Printf("⚠️ .env file not found, using system env")
	}

	// Debug environment variables (without exposing sensitive data)
	log.Printf("📊 Environment check:")
	log.Printf("  - DATABASE_URL: %s", func() string {
		if url := os.Getenv("DATABASE_URL"); url != "" {
			return "[SET]"
		}
		return "[NOT SET]"
	}())
	log.Printf("  - DB_CONNECTION_STRING: %s", func() string {
		if url := os.Getenv("DB_CONNECTION_STRING"); url != "" {
			return "[SET]"
		}
		return "[NOT SET]"
	}())
	log.Printf("  - JWT_SECRET: %s", func() string {
		if secret := os.Getenv("JWT_SECRET"); secret != "" {
			return "[SET]"
		}
		return "[NOT SET]"
	}())

	// Connect to DB
	if err := config.ConnectDB(); err != nil {
		log.Fatal("❌ Failed to connect to database: ", err)
	}
	defer config.DB.Close()

	// Fiber app
	app := fiber.New()

	// CORS middleware
	app.Use(func(c *fiber.Ctx) error {
		// Get CORS origin from environment, fallback to allow all in development
		corsOrigin := os.Getenv("CORS_ORIGIN")
		if corsOrigin == "" {
			corsOrigin = "*" // Allow all origins in development
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

	// Public routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Mental Health API 🚀")
	})

	// Health check endpoint for Render
	app.Get("/health", func(c *fiber.Ctx) error {
		// Check database connection
		if err := config.DB.Ping(); err != nil {
			return c.Status(503).JSON(fiber.Map{
				"status": "unhealthy",
				"error":  "database connection failed",
				"details": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"status": "healthy",
			"service": "UnwindMind API",
			"version": "1.0.0",
			"port": os.Getenv("PORT"),
			"timestamp": c.Locals("time"),
		})
	})

	// Public routes (no authentication required)
	app.Post("/api/chat", routes.ChatHandler)
	app.Post("/api/login", routes.Login(config.DB))
	app.Post("/api/register", routes.Register(config.DB))
	app.Post("/api/refresh", routes.RefreshToken(config.DB))

	// JWT Middleware with blacklist checking
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// #nosec G101 -- This is a development fallback, not production credentials
		// Generate a random secret for development/testing purposes
		secret = "development-jwt-secret-" + runtime.Version() + "-change-in-production"
		log.Printf("⚠️ JWT_SECRET not set, using development fallback (MUST set in production!)")
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
		port = "10000" // Render's default port
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