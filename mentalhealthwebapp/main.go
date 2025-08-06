package main

import (
	"log"
	"os"

	"github.com/leketech/mental-health-app/config"
	"github.com/leketech/mental-health-app/middleware"
	"github.com/leketech/mental-health-app/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Printf("⚠️ .env file not found, using system env")
	}

	// Connect to DB
	if err := config.ConnectDB(); err != nil {
		log.Fatal("❌ Failed to connect to database: ", err)
	}
	defer config.DB.Close()

	// Fiber app
	app := fiber.New()

	// CORS middleware
	app.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Method() == "OPTIONS" {
			return c.SendStatus(200)
		}

		return c.Next()
	})

	// Public routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Mental Health API 🚀")
	})

	// Public routes (no authentication required)
	app.Post("/api/chat", routes.ChatHandler)
	app.Post("/api/login", routes.Login(config.DB))
	app.Post("/api/register", routes.Register(config.DB))
	app.Post("/api/refresh", routes.RefreshToken(config.DB))

	// JWT Middleware with blacklist checking
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("❌ JWT_SECRET is not set")
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
		port = "8080"
	}
	log.Printf("✅ Server running on http://0.0.0.0:%s", port)
    log.Fatal(app.Listen("0.0.0.0:" + port))
}
