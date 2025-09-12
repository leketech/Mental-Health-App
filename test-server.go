package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	app := fiber.New()

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "UnwindMind API (Test Mode)",
			"version": "1.0.0",
			"mode":    "no-database",
		})
	})

	// Simple registration without database (for testing)
	app.Post("/api/register", func(c *fiber.Ctx) error {
		type Request struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// Basic validation
		if req.Name == "" || req.Email == "" || req.Password == "" {
			return c.Status(400).JSON(fiber.Map{
				"error": "Name, email, and password are required",
			})
		}

		if len(req.Password) < 6 {
			return c.Status(400).JSON(fiber.Map{
				"error": "Password must be at least 6 characters",
			})
		}

		// Hash password (just for testing, not storing anywhere)
		_, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Could not hash password",
			})
		}

		// Simulate successful registration
		log.Printf("✅ Registration test successful - Name: %s, Email: %s", req.Name, req.Email)

		return c.Status(201).JSON(fiber.Map{
			"message": "User registered successfully (test mode)",
			"user_id": 999, // Test user ID
			"email":   req.Email,
			"note":    "This is a test registration without database storage",
		})
	})

	// Simple login for testing
	app.Post("/api/login", func(c *fiber.Ctx) error {
		type Request struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		log.Printf("✅ Login test attempted - Email: %s", req.Email)

		return c.JSON(fiber.Map{
			"message":       "Login successful (test mode)",
			"access_token":  "test-access-token-123",
			"refresh_token": "test-refresh-token-456",
			"expires_in":    3600,
			"user": fiber.Map{
				"id":    999,
				"name":  "Test User",
				"email": req.Email,
			},
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("🚀 Test server starting on port %s (no database required)", port)
	log.Printf("💡 This is a test server for registration functionality")
	log.Fatal(app.Listen(":" + port))
}