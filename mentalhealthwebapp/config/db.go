package config

import (
    "database/sql"
    "log"
    "os"

    _ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() error {
    connStr := os.Getenv("DB_CONNECTION_STRING")
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
    return nil
}