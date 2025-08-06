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
func MockValidateUser(email, password string) (*User, error) {
    if email == "john@example.com" && password == "password123" {
        return &User{
            ID:    1,
            Name:  "John Doe",
            Email: "john@example.com",
        }, nil
    }
    return nil, errors.New("invalid credentials")
}
