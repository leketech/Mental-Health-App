package config

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    "strings"

    _ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() error {
    log.Printf("🔍 Starting database connection process...")
    
    // Try Railway's DATABASE_URL first, then fallback to DB_CONNECTION_STRING
    connStr := os.Getenv("DATABASE_URL")
    if connStr != "" {
        log.Printf("✅ Found DATABASE_URL environment variable")
    }
    
    if connStr == "" {
        connStr = os.Getenv("DB_CONNECTION_STRING")
        if connStr != "" {
            log.Printf("✅ Found DB_CONNECTION_STRING environment variable")
        }
    }
    
    // Log debugging information (without exposing full connection string)
    if connStr != "" {
        // Log connection attempt (mask sensitive parts)
        maskedConnStr := maskConnectionString(connStr)
        log.Printf("🔗 Using database connection string: %s", maskedConnStr)
        
        // Force the use of the environment variable and replace localhost with db if needed
        // This is a workaround for environments that might be overriding our settings
        if strings.Contains(connStr, "localhost") || strings.Contains(connStr, "127.0.0.1") {
            // Replace localhost with db for Docker Compose environments
            connStr = strings.Replace(connStr, "localhost", "db", -1)
            connStr = strings.Replace(connStr, "127.0.0.1", "db", -1)
            log.Printf("🔧 Replaced localhost with db in connection string")
            maskedConnStr = maskConnectionString(connStr)
            log.Printf("🔗 Updated connection string: %s", maskedConnStr)
        }
    } else {
        log.Printf("⚠️ No DATABASE_URL or DB_CONNECTION_STRING found, trying to construct from individual variables...")
        
        // If we still don't have a connection string, try to construct one from Railway variables
        // Try to construct from individual Railway variables
        host := os.Getenv("RAILWAY_POSTGRES_HOST")
        if host == "" {
            host = os.Getenv("PGHOST")
        }
        if host == "" {
            host = "db" // Default to db service for Docker Compose
        }
        port := os.Getenv("RAILWAY_POSTGRES_PORT")
        if port == "" {
            port = os.Getenv("PGPORT")
        }
        if port == "" {
            port = "5432"
        }
        user := os.Getenv("RAILWAY_POSTGRES_USER")
        if user == "" {
            user = os.Getenv("PGUSER")
        }
        if user == "" {
            user = "mental_user"
        }
        password := os.Getenv("RAILWAY_POSTGRES_PASSWORD")
        if password == "" {
            password = os.Getenv("PGPASSWORD")
        }
        if password == "" {
            password = "mental_pass"
        }
        database := os.Getenv("RAILWAY_POSTGRES_DATABASE")
        if database == "" {
            database = os.Getenv("PGDATABASE")
        }
        if database == "" {
            database = "mental_db"
        }
        
        log.Printf("🔧 Individual variables - Host: %s, Port: %s, User: %s, Database: %s", host, port, user, database)
        
        // Construct the connection string
        connStr = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", 
            host, port, user, password, database)
        log.Printf("🔧 Constructed connection string from individual variables")
    }
    
    if connStr == "" {
        log.Printf("❌ No database connection string found. Please set DATABASE_URL or DB_CONNECTION_STRING")
        log.Printf("💡 Make sure you have added a PostgreSQL service to your deployment platform")
        return sql.ErrConnDone
    }
    
    // Log connection attempt (mask sensitive parts)
    maskedConnStr := maskConnectionString(connStr)
    log.Printf("🔗 Attempting database connection to: %s", maskedConnStr)

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Printf("❌ Failed to open database connection: %v", err)
        return err
    }

    // Set connection pool settings for production
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)
    db.SetConnMaxLifetime(0) // Use default

    if err = db.Ping(); err != nil {
        log.Printf("❌ Failed to ping database: %v", err)
        return err
    }

    DB = db
    log.Println("✅ Database connected")
    
    // Run database migrations
    if err := runMigrations(db); err != nil {
        log.Printf("⚠️ Migration error: %v", err)
        return err
    }
    
    return nil
}

// maskConnectionString hides sensitive information in connection string for logging
func maskConnectionString(connStr string) string {
    // Mask password
    if strings.Contains(connStr, "password=") {
        parts := strings.Split(connStr, "password=")
        if len(parts) > 1 {
            passwordPart := parts[1]
            // Find the end of the password (next space or end of string)
            endIdx := strings.Index(passwordPart, " ")
            if endIdx == -1 {
                endIdx = len(passwordPart)
            }
            if endIdx > 0 {
                maskedPassword := strings.Repeat("*", len(passwordPart[:endIdx]))
                return parts[0] + "password=" + maskedPassword + passwordPart[endIdx:]
            }
        }
    }
    return connStr
}

// runMigrations ensures all required tables exist
func runMigrations(db *sql.DB) error {
    migrations := []string{
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
        
        // Moods table
        `CREATE TABLE IF NOT EXISTS moods (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            mood VARCHAR(50),
            note TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
        
        // Journals table
        `CREATE TABLE IF NOT EXISTS journals (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            title VARCHAR(100) NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
        
        // Refresh tokens table
        `CREATE TABLE IF NOT EXISTS refresh_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            token_hash VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            revoked BOOLEAN DEFAULT FALSE,
            revoked_at TIMESTAMP NULL
        );`,
        
        // Blacklisted tokens table
        `CREATE TABLE IF NOT EXISTS blacklisted_tokens (
            id SERIAL PRIMARY KEY,
            token_hash VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
        
        // Create indexes
        `CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);`,
        `CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);`,
        `CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_token_hash ON blacklisted_tokens(token_hash);`,
        `CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_expires_at ON blacklisted_tokens(expires_at);`,
    }
    
    for i, migration := range migrations {
        if _, err := db.Exec(migration); err != nil {
            log.Printf("❌ Migration %d failed: %v", i+1, err)
            return err
        }
    }
    
    log.Println("✅ Database migrations completed")
    return nil
}