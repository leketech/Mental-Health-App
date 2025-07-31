// middleware/auth.go
package middleware

import (
    "github.com/gofiber/fiber/v2"
    jwt "github.com/gofiber/jwt/v3"
)

// JWTProtected creates a JWT middleware using the provided secret
func JWTProtected(secret string) fiber.Handler {
    return jwt.New(jwt.Config{
        SigningKey: []byte(secret),
    })
}