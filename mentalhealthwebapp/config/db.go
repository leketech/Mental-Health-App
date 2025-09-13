package config

import (
    "database/sql"
    "log"
    "os"

    _ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() error {
    // Try Railway's DATABASE_URL first, then fallback to DB_CONNECTION_STRING
    connStr := os.Getenv("DATABASE_URL")
    if connStr == "" {
        connStr = os.Getenv("DB_CONNECTION_STRING")
    }
    
    // Log debugging information (without exposing full connection string)
    if connStr == "" {
        log.Printf("❌ No database connection string found. Please set DATABASE_URL or DB_CONNECTION_STRING")
        log.Printf("💡 Make sure you have added a PostgreSQL service to your Railway project")
        return sql.ErrConnDone
    }
    
    // Log connection attempt (mask sensitive parts)
    if len(connStr) > 20 {
        log.Printf("🔗 Attempting database connection to: %s...%s", connStr[:10], connStr[len(connStr)-10:])
    } else {
        log.Printf("🔗 Attempting database connection (connection string too short, might be invalid)")
    }

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Printf("❌ Failed to open database connection: %v", err)
        return err
    }

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