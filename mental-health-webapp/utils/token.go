// utils/token.go
package utils

import (
    "time"

    "github.com/golang-jwt/jwt/v4"
)

// JWTSecret is used to sign JWT tokens
// In production, load this from environment variables
var JWTSecret = []byte("supersecretkey")

// GenerateJWT creates a new JWT token for a given user ID
func GenerateJWT(userID int) (string, error) {
    // Create a new token
    token := jwt.New(jwt.SigningMethodHS256)

    // Set claims (payload)
    claims := token.Claims.(jwt.MapClaims)
    claims["sub"] = userID                    // Subject (user ID)
    claims["exp"] = time.Now().Add(24 * time.Hour).Unix() // Expiry: 24 hours

    // Sign and return the token
    return token.SignedString(JWTSecret)
}
