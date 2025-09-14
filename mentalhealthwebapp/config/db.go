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