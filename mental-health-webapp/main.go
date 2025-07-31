package main

import (
    "log"
    "os"

    "mental-health-webapp/config"
    "mental-health-webapp/routes"
    "mental-health-webapp/middleware"

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

    // Public routes
    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Mental Health API 🚀")
    })

    app.Post("/api/chat", routes.ChatHandler)

    // JWT Middleware
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        log.Fatal("❌ JWT_SECRET is not set")
    }
    jwtMiddleware := middleware.JWTProtected(secret)

    // Protected API routes
    api := app.Group("/api", jwtMiddleware)
    api.Get("/moods", routes.GetMoods(config.DB))
    api.Get("/journals", routes.GetJournals(config.DB))
    api.Post("/journals", routes.CreateJournal(config.DB))

    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    log.Printf("✅ Server running on http://localhost:%s", port)
    log.Fatal(app.Listen(":" + port))
}