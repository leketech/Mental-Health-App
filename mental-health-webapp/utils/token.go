// utils/token.go
package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// TokenPair represents access and refresh tokens
type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"` // Access token expiry in seconds
}

// getJWTSecret returns the JWT secret from environment or default
func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "supersecretkey" // Fallback for development
	}
	return []byte(secret)
}

// GetJWTSecret exports the JWT secret for external use
func GetJWTSecret() []byte {
	return getJWTSecret()
}

// GenerateJWT creates a new access JWT token for a given user ID (short-lived)
func GenerateJWT(userID int) (string, error) {
	return generateJWTWithExpiry(userID, 30*time.Minute) // 30 minutes
}

// GenerateRefreshToken creates a new refresh JWT token for a given user ID (long-lived)
func GenerateRefreshToken(userID int) (string, error) {
	return generateJWTWithExpiry(userID, 7*24*time.Hour) // 7 days
}

// generateJWTWithExpiry creates a JWT token with custom expiry
func generateJWTWithExpiry(userID int, expiry time.Duration) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = userID
	claims["exp"] = time.Now().Add(expiry).Unix()
	claims["iat"] = time.Now().Unix() // Issued at

	return token.SignedString(getJWTSecret())
}

// GenerateTokenPair creates both access and refresh tokens
func GenerateTokenPair(userID int) (*TokenPair, error) {
	accessToken, err := GenerateJWT(userID)
	if err != nil {
		return nil, err
	}

	refreshToken, err := GenerateRefreshToken(userID)
	if err != nil {
		return nil, err
	}

	return &TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    30 * 60, // 30 minutes in seconds
	}, nil
}

// GenerateSecureToken creates a cryptographically secure random token
func GenerateSecureToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// HashToken creates a SHA256 hash of a token for secure storage
func HashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}
