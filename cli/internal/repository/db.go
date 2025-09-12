// internal/repository/db.go
package repository

import (
    "log"

    "go.etcd.io/bbolt"
)

var db *bbolt.DB

// InitDB initializes the database and creates required buckets
func InitDB() {
    var err error
    db, err = bbolt.Open("mental_health.db", 0600, nil)
    if err != nil {
        log.Fatal("Failed to open DB:", err)
    }

    err = db.Update(func(tx *bbolt.Tx) error {
        _, err := tx.CreateBucketIfNotExists([]byte("Mood"))
        if err != nil {
            log.Println("Failed to create Mood bucket:", err)
            return err
        }
        _, err = tx.CreateBucketIfNotExists([]byte("Journal"))
        if err != nil {
            log.Println("Failed to create Journal bucket:", err)
            return err
        }
        return nil
    })

    if err != nil {
        log.Fatal("Failed to initialize DB:", err)
    }
}

// CloseDB safely closes the database connection
func CloseDB() {
    if db != nil {
        db.Close()
    }
}