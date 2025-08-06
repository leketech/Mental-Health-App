// routes/auth.go
package routes

import (
	"database/sql"
	"fmt"
	"log"
	"github.com/leketech/mental-health-app/services"
	"github.com/leketech/mental-health-app/utils"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// Login handles user authentication and returns access and refresh tokens
func Login(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
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

		// Get user from database
		var user struct {
			ID           int    `json:"id"`
			Name         string `json:"name"`
			Email        string `json:"email"`
			PasswordHash string `json:"-"`
		}

		query := `SELECT id, name, email, password_hash FROM users WHERE email = $1`
		err := db.QueryRow(query, req.Email).Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash)
		if err != nil {
			if err == sql.ErrNoRows {
				return c.Status(401).JSON(fiber.Map{
					"error": "Invalid email or password",
				})
			}
			log.Printf("Login query error: %v", err)
			return c.Status(500).JSON(fiber.Map{
				"error": "Internal server error",
			})
		}

		// Verify password
		err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
		if err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid email or password",
			})
		}

		// Generate token pair (access + refresh tokens)
		tokenPair, err := utils.GenerateTokenPair(user.ID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to generate tokens",
			})
		}

		// Initialize refresh token service and store refresh token
		refreshService := services.NewRefreshTokenService(db)
		expiresAt := time.Now().Add(7 * 24 * time.Hour) // 7 days
		if err := refreshService.StoreRefreshToken(user.ID, tokenPair.RefreshToken, expiresAt); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to store refresh token",
			})
		}

		// ✅ Return success with both tokens
		return c.JSON(fiber.Map{
			"message":       "Login successful",
			"access_token":  tokenPair.AccessToken,
			"refresh_token": tokenPair.RefreshToken,
			"expires_in":    tokenPair.ExpiresIn,
			"user":          user,
		})
	}
}

// Register handles user registration
func Register(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
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

		// Save user to database
		query := `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`
		var userID int
		err = db.QueryRow(query, req.Name, req.Email, string(hashed)).Scan(&userID)
		if err != nil {
			if strings.Contains(err.Error(), "duplicate key") {
				return c.Status(409).JSON(fiber.Map{
					"error": "Email already exists",
				})
			}
			log.Printf("Registration error: %v", err)
			return c.Status(500).JSON(fiber.Map{
				"error": "Could not create user",
			})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "User registered successfully",
			"user_id": userID,
			"email":   req.Email,
		})
	}
}

// RefreshToken handles token refresh using refresh tokens
func RefreshToken(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		type Request struct {
			RefreshToken string `json:"refresh_token" validate:"required"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// Initialize refresh token service
		refreshService := services.NewRefreshTokenService(db)

		// Validate refresh token
		userID, err := refreshService.ValidateRefreshToken(req.RefreshToken)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid or expired refresh token",
			})
		}

		// Generate new token pair
		tokenPair, err := utils.GenerateTokenPair(userID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to generate tokens",
			})
		}

		// Store new refresh token
		expiresAt := time.Now().Add(7 * 24 * time.Hour) // 7 days
		if err := refreshService.StoreRefreshToken(userID, tokenPair.RefreshToken, expiresAt); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to store refresh token",
			})
		}

		// Optionally revoke old refresh token (token rotation)
		if err := refreshService.RevokeRefreshToken(req.RefreshToken); err != nil {
			// Log error but don't fail the request
			fmt.Printf("Warning: Failed to revoke old refresh token: %v\n", err)
		}

		return c.JSON(fiber.Map{
			"message":       "Token refreshed successfully",
			"access_token":  tokenPair.AccessToken,
			"refresh_token": tokenPair.RefreshToken,
			"expires_in":    tokenPair.ExpiresIn,
		})
	}
}

// Logout handles user logout and token revocation
func Logout(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		type Request struct {
			RefreshToken string `json:"refresh_token"`
			LogoutAll    bool   `json:"logout_all"` // Optional: logout from all devices
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// Initialize refresh token service
		refreshService := services.NewRefreshTokenService(db)

		// Get user ID from JWT context (if available)
		userID, hasUserID := c.Locals("userID").(int)

		// If logout_all is true and we have user ID, revoke all user tokens
		if req.LogoutAll && hasUserID {
			if err := refreshService.RevokeAllUserTokens(userID); err != nil {
				return c.Status(500).JSON(fiber.Map{
					"error": "Failed to logout from all devices",
				})
			}
		} else if req.RefreshToken != "" {
			// Revoke specific refresh token
			if err := refreshService.RevokeRefreshToken(req.RefreshToken); err != nil {
				// Don't fail if token doesn't exist - user might already be logged out
				fmt.Printf("Warning: Failed to revoke refresh token: %v\n", err)
			}
		}

		// Blacklist current access token if available
		if hasUserID {
			// Extract access token from Authorization header
			authHeader := c.Get("Authorization")
			if authHeader != "" && len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				accessToken := authHeader[7:]

				// Parse token to get expiry
				token, err := jwt.Parse(accessToken, func(token *jwt.Token) (interface{}, error) {
					return utils.GetJWTSecret(), nil
				})

				if err == nil {
					if claims, ok := token.Claims.(jwt.MapClaims); ok {
						if exp, ok := claims["exp"].(float64); ok {
							expiresAt := time.Unix(int64(exp), 0)
							refreshService.BlacklistAccessToken(accessToken, expiresAt)
						}
					}
				}
			}
		}

		message := "Logged out successfully"
		if req.LogoutAll {
			message = "Logged out from all devices successfully"
		}

		return c.JSON(fiber.Map{
			"message": message,
		})
	}
}
