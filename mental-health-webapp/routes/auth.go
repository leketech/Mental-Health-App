// routes/auth.go
package routes

import (
    "fmt"
    "mental-health-webapp/utils"

    "github.com/gofiber/fiber/v2"
    "golang.org/x/crypto/bcrypt"
)

// Login handles user authentication and returns a JWT
func Login(c *fiber.Ctx) error {
    type Request struct {
        Email    string `json:"email" validate:"required,email"`
        Password string `json:"password" validate:"required"`
    }

    var req Request
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request body",
        })
    }

    // Validate credentials using mock
    user, err := utils.MockValidateUser(req.Email, req.Password)
    if err != nil {
        return c.Status(401).JSON(fiber.Map{
            "error": "Invalid email or password",
        })
    }

    // Generate JWT
    token, err := utils.GenerateJWT(user.ID)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to generate token",
        })
    }

    // ✅ Return success
    return c.JSON(fiber.Map{
        "message": "Login successful",
        "token":   token,
        "user":    user,
    })
}

// Register handles user registration (mock)
func Register(c *fiber.Ctx) error {
    type Request struct {
        Name     string `json:"name" validate:"required"`
        Email    string `json:"email" validate:"required,email"`
        Password string `json:"password" validate:"required,min=6"`
    }

    var req Request
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request",
        })
    }

    // Hash password
    hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Could not hash password",
        })
    }

    // 🔁 Use `hashed` to avoid "declared and not used"
    // In real app: save user to DB with hashed password
    fmt.Printf("User registered: %s, hashed password: %s\n", req.Email, hashed)

    return c.Status(201).JSON(fiber.Map{
        "message": "User registered successfully (mock)",
        "email":   req.Email,
    })
}