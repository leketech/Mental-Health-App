// main.go
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
    // ✅ Load .env file
    if err := godotenv.Load(); err != nil {
        log.Printf("⚠️ .env file not found, using system environment")
    }

    // ✅ Get JWT secret
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        log.Fatal("❌ JWT_SECRET is not set in environment")
    }

    // ✅ Connect to database
    if err := config.ConnectDB(); err != nil {
        log.Fatal("❌ Failed to connect to database: ", err)
    }
    defer config.DB.Close()

    // ✅ Initialize Fiber app
    app := fiber.New()

    // ✅ Public routes
    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Mental Health API 🚀")
    })

    app.Post("/api/chat", routes.ChatHandler)

    // ✅ Setup JWT middleware
    jwtMiddleware := middleware.JWTProtected(secret)

    // ✅ Protected API group
    api := app.Group("/api", jwtMiddleware)

    // ✅ Protected routes
    api.Get("/moods", routes.GetMoods(config.DB))
    api.Get("/journals", routes.GetJournals(config.DB))
    api.Post("/journals", routes.CreateJournal(config.DB))

    // ✅ Login and Register (public auth routes)
    app.Post("/api/login", routes.Login)
    app.Post("/api/register", routes.Register)

    // ✅ Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("✅ Server running on http://localhost:%s", port)
    log.Fatal(app.Listen(":" + port))
}