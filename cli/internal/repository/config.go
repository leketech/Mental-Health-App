// internal/repository/config.go
package repository

import (
    "fmt"
    "os"

    "github.com/joho/godotenv"
)

// Config holds all the configuration for the app
type Config struct {
    DBFile        string
    EncryptionKey []byte
    Env           string
    Debug         bool
}

// LoadConfig loads configuration from environment variables
func LoadConfig() (*Config, error) {
    // Load .env file if it exists
    _ = godotenv.Load()

    // Read environment variables
    dbFile := os.Getenv("DB_FILE")
    if dbFile == "" {
        dbFile = "mental_health.db" // default
    }

    encryptionKey := os.Getenv("ENCRYPTION_KEY")
    if encryptionKey == "" {
        fmt.Println("[WARNING] Using default encryption key. Set ENCRYPTION_KEY for production.")
        encryptionKey = "default-32-byte-encryption-key!!!!" // 32 bytes
    }

    return &Config{
        DBFile:        dbFile,
        EncryptionKey: []byte(encryptionKey),
        Env:           os.Getenv("ENV"),
        Debug:         os.Getenv("DEBUG") == "true",
    }, nil
}