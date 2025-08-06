// middleware/auth.go
package middleware

import (
	"database/sql"
	"mentalhealthwebapp/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/golang-jwt/jwt/v4"
)

// JWTProtected creates a JWT middleware using the provided secret
func JWTProtected(secret string) fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey: []byte(secret),
		SuccessHandler: func(c *fiber.Ctx) error {
			// Extract user ID from JWT token and add to context
			user := c.Locals("user").(*jwt.Token)
			claims := user.Claims.(jwt.MapClaims)

			// Get user ID from claims
			userIDFloat, ok := claims["sub"].(float64)
			if !ok {
				return c.Status(401).JSON(fiber.Map{
					"error": "Invalid token: missing user ID",
				})
			}

			userID := int(userIDFloat)

			// Store user ID in context for use in handlers
			c.Locals("userID", userID)
			c.Locals("userIDStr", strconv.Itoa(userID))

			return c.Next()
		},
	})
}

// JWTProtectedWithBlacklist creates a JWT middleware with token blacklist checking
func JWTProtectedWithBlacklist(secret string, db *sql.DB) fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey: []byte(secret),
		SuccessHandler: func(c *fiber.Ctx) error {
			// Extract access token from Authorization header
			authHeader := c.Get("Authorization")
			if authHeader == "" || len(authHeader) <= 7 || authHeader[:7] != "Bearer " {
				return c.Status(401).JSON(fiber.Map{
					"error": "Invalid authorization header",
				})
			}

			accessToken := authHeader[7:]

			// Check if token is blacklisted
			refreshService := services.NewRefreshTokenService(db)
			if refreshService.IsTokenBlacklisted(accessToken) {
				return c.Status(401).JSON(fiber.Map{
					"error": "Token has been revoked",
				})
			}

			// Extract user ID from JWT token and add to context
			user := c.Locals("user").(*jwt.Token)
			claims := user.Claims.(jwt.MapClaims)

			// Get user ID from claims
			userIDFloat, ok := claims["sub"].(float64)
			if !ok {
				return c.Status(401).JSON(fiber.Map{
					"error": "Invalid token: missing user ID",
				})
			}

			userID := int(userIDFloat)

			// Store user ID and token in context for use in handlers
			c.Locals("userID", userID)
			c.Locals("userIDStr", strconv.Itoa(userID))
			c.Locals("accessToken", accessToken)

			return c.Next()
		},
	})
}
