// utils/auth.go
package utils

import "errors"

// User represents a user in the system
type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// MockValidateUser checks if email and password are valid (mock for now)
// DEPRECATED: This function contains hardcoded credentials and should not be used in production
// Use database-based authentication in routes/auth.go instead
func MockValidateUser(email, password string) (*User, error) {
	// SECURITY WARNING: This contains hardcoded credentials - DO NOT USE IN PRODUCTION
	if email == "demo@example.com" && password == "demo123456" {
		return &User{
			ID:    1,
			Name:  "Demo User",
			Email: "demo@example.com",
		}, nil
	}
	return nil, errors.New("invalid credentials")
}
