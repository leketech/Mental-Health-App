// mood.go
package repository

import (
    "bufio"
    "fmt"
    "time"

    "go.etcd.io/bbolt"
)

func LogMood(scanner *bufio.Scanner) {
    fmt.Print("How are you feeling today? (happy/sad/anxious/etc): ")
    scanner.Scan()
    mood := scanner.Text()
    timestamp := time.Now().Format(time.RFC3339)

    err := db.Update(func(tx *bbolt.Tx) error {
        b := tx.Bucket([]byte("Mood"))
        return b.Put([]byte(timestamp), []byte(mood))
    })
    if err != nil {
        fmt.Println("Failed to log mood:", err)
        return
    }
    fmt.Println("Mood saved ✅")
}

func ViewMoodHistory() {
    fmt.Println("Mood History:")
    err := db.View(func(tx *bbolt.Tx) error {
        b := tx.Bucket([]byte("Mood"))
        return b.ForEach(func(k, v []byte) error {
            fmt.Printf("%s - %s\n", k, v)
            return nil
        })
    })
    if err != nil {
        fmt.Println("Failed to read mood history:", err)
    }
}