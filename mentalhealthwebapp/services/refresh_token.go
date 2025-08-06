package services

import (
	"database/sql"
	"log"
	"github.com/leketech/mental-health-app/utils"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// RefreshTokenService handles refresh token operations
type RefreshTokenService struct {
	db *sql.DB
}

// NewRefreshTokenService creates a new refresh token service
func NewRefreshTokenService(db *sql.DB) *RefreshTokenService {
	return &RefreshTokenService{db: db}
}

// StoreRefreshToken stores a refresh token in the database
func (s *RefreshTokenService) StoreRefreshToken(userID int, refreshToken string, expiresAt time.Time) error {
	tokenHash := utils.HashToken(refreshToken)
	
	query := `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`
	_, err := s.db.Exec(query, userID, tokenHash, expiresAt)
	if err != nil {
		log.Printf("Error storing refresh token: %v", err)
		return err
	}
	
	return nil
}

// ValidateRefreshToken checks if a refresh token is valid and not revoked
func (s *RefreshTokenService) ValidateRefreshToken(refreshToken string) (int, error) {
	tokenHash := utils.HashToken(refreshToken)
	
	var userID int
	var expiresAt time.Time
	var revoked bool
	
	query := `SELECT user_id, expires_at, revoked FROM refresh_tokens WHERE token_hash = $1`
	err := s.db.QueryRow(query, tokenHash).Scan(&userID, &expiresAt, &revoked)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, jwt.NewValidationError("invalid refresh token", jwt.ValidationErrorMalformed)
		}
		log.Printf("Error validating refresh token: %v", err)
		return 0, err
	}
	
	// Check if token is revoked
	if revoked {
		return 0, jwt.NewValidationError("refresh token revoked", jwt.ValidationErrorMalformed)
	}
	
	// Check if token is expired
	if time.Now().After(expiresAt) {
		return 0, jwt.NewValidationError("refresh token expired", jwt.ValidationErrorExpired)
	}
	
	return userID, nil
}

// RevokeRefreshToken marks a refresh token as revoked
func (s *RefreshTokenService) RevokeRefreshToken(refreshToken string) error {
	tokenHash := utils.HashToken(refreshToken)
	
	query := `UPDATE refresh_tokens SET revoked = TRUE, revoked_at = CURRENT_TIMESTAMP WHERE token_hash = $1`
	result, err := s.db.Exec(query, tokenHash)
	if err != nil {
		log.Printf("Error revoking refresh token: %v", err)
		return err
	}
	
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rowsAffected == 0 {
		return jwt.NewValidationError("refresh token not found", jwt.ValidationErrorMalformed)
	}
	
	return nil
}

// RevokeAllUserTokens revokes all refresh tokens for a specific user
func (s *RefreshTokenService) RevokeAllUserTokens(userID int) error {
	query := `UPDATE refresh_tokens SET revoked = TRUE, revoked_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND revoked = FALSE`
	_, err := s.db.Exec(query, userID)
	if err != nil {
		log.Printf("Error revoking all user tokens: %v", err)
		return err
	}
	
	return nil
}

// BlacklistAccessToken adds an access token to the blacklist
func (s *RefreshTokenService) BlacklistAccessToken(accessToken string, expiresAt time.Time) error {
	tokenHash := utils.HashToken(accessToken)
	
	query := `INSERT INTO blacklisted_tokens (token_hash, expires_at) VALUES ($1, $2) ON CONFLICT (token_hash) DO NOTHING`
	_, err := s.db.Exec(query, tokenHash, expiresAt)
	if err != nil {
		log.Printf("Error blacklisting access token: %v", err)
		return err
	}
	
	return nil
}

// IsTokenBlacklisted checks if an access token is blacklisted
func (s *RefreshTokenService) IsTokenBlacklisted(accessToken string) bool {
	tokenHash := utils.HashToken(accessToken)
	
	var count int
	query := `SELECT COUNT(*) FROM blacklisted_tokens WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP`
	err := s.db.QueryRow(query, tokenHash).Scan(&count)
	if err != nil {
		log.Printf("Error checking blacklisted token: %v", err)
		return false
	}
	
	return count > 0
}

// CleanupExpiredTokens removes expired tokens from the database
func (s *RefreshTokenService) CleanupExpiredTokens() error {
	// Clean up expired refresh tokens
	_, err := s.db.Exec(`DELETE FROM refresh_tokens WHERE expires_at < CURRENT_TIMESTAMP`)
	if err != nil {
		log.Printf("Error cleaning up expired refresh tokens: %v", err)
		return err
	}
	
	// Clean up expired blacklisted tokens
	_, err = s.db.Exec(`DELETE FROM blacklisted_tokens WHERE expires_at < CURRENT_TIMESTAMP`)
	if err != nil {
		log.Printf("Error cleaning up expired blacklisted tokens: %v", err)
		return err
	}
	
	return nil
}

// RotateRefreshToken revokes the old token and creates a new one
func (s *RefreshTokenService) RotateRefreshToken(oldRefreshToken string, userID int) (string, error) {
	// Revoke the old token
	if err := s.RevokeRefreshToken(oldRefreshToken); err != nil {
		return "", err
	}
	
	// Generate new refresh token
	newRefreshToken, err := utils.GenerateRefreshToken(userID)
	if err != nil {
		return "", err
	}
	
	// Store the new token
	expiresAt := time.Now().Add(7 * 24 * time.Hour) // 7 days
	if err := s.StoreRefreshToken(userID, newRefreshToken, expiresAt); err != nil {
		return "", err
	}
	
	return newRefreshToken, nil
}
