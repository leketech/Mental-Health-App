// routes/auth.go
package routes

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/leketech/mental-health-app/services"
	"github.com/leketech/mental-health-app/utils"
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

		err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
		if err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid email or password",
			})
		}

		tokenPair, err := utils.GenerateTokenPair(user.ID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to generate tokens",
			})
		}

		refreshService := services.NewRefreshTokenService(db)
		expiresAt := time.Now().Add(7 * 24 * time.Hour)
		if err := refreshService.StoreRefreshToken(user.ID, tokenPair.RefreshToken, expiresAt); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to store refresh token",
			})
		}

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

		hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Could not hash password",
			})
		}

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

// RefreshToken handles token refresh
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

		refreshService := services.NewRefreshTokenService(db)
		userID, err := refreshService.ValidateRefreshToken(req.RefreshToken)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid or expired refresh token",
			})
		}

		tokenPair, err := utils.GenerateTokenPair(userID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to generate tokens",
			})
		}

		expiresAt := time.Now().Add(7 * 24 * time.Hour)
		if err := refreshService.StoreRefreshToken(userID, tokenPair.RefreshToken, expiresAt); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to store refresh token",
			})
		}

		if err := refreshService.RevokeRefreshToken(req.RefreshToken); err != nil {
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
			LogoutAll    bool   `json:"logout_all"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		refreshService := services.NewRefreshTokenService(db)
		userID, hasUserID := c.Locals("userID").(int)

		if req.LogoutAll && hasUserID {
			if err := refreshService.RevokeAllUserTokens(userID); err != nil {
				return c.Status(500).JSON(fiber.Map{
					"error": "Failed to logout from all devices",
				})
			}
		} else if req.RefreshToken != "" {
			if err := refreshService.RevokeRefreshToken(req.RefreshToken); err != nil {
				fmt.Printf("Warning: Failed to revoke refresh token: %v\n", err)
			}
		}

		if hasUserID {
			authHeader := c.Get("Authorization")
			if authHeader != "" && len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				accessToken := authHeader[7:]

				token, parseErr := jwt.Parse(accessToken, func(token *jwt.Token) (interface{}, error) {
					return utils.GetJWTSecret(), nil
				})

				var expiresAt time.Time
				if parseErr == nil && token.Claims != nil {
					if claims, ok := token.Claims.(jwt.MapClaims); ok {
						if exp, exists := claims["exp"].(float64); exists {
							expiresAt = time.Unix(int64(exp), 0)
						}
					}
				}
				if expiresAt.IsZero() {
					expiresAt = time.Now().Add(15 * time.Minute)
				}

				if err := refreshService.BlacklistAccessToken(accessToken, expiresAt); err != nil {
					log.Printf("Failed to blacklist access token: %v", err)
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