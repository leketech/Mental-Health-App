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
    
    if connStr == "" {
        return sql.ErrConnDone
    }

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return err
    }

    if err = db.Ping(); err != nil {
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