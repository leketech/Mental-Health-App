// internal/repository/journal.go
package repository
// journal.go   

import (
    "bufio"
    "fmt"
    "time"

    "go.etcd.io/bbolt"
    "golang.org/x/crypto/bcrypt"
)

func WriteJournal(scanner *bufio.Scanner) {
    fmt.Println("Write about your day:")
    scanner.Scan()
    entry := scanner.Text()
    timestamp := time.Now().Format(time.RFC3339)

    hashed, err := bcrypt.GenerateFromPassword([]byte(entry), bcrypt.DefaultCost)
    if err != nil {
        fmt.Println("Error hashing journal entry:", err)
        return
    }

    db.Update(func(tx *bbolt.Tx) error {
        b := tx.Bucket([]byte("Journal"))
        return b.Put([]byte(timestamp), hashed)
    })

    fmt.Println("Encrypted journal saved ✅")
}