// journal_test.go

package repository

import (
    "bufio"
    "os"
    "strings"
    "testing"

    "go.etcd.io/bbolt"
)

// var db *bbolt.DB

// setup initializes a temporary test database
func setup(t *testing.T) func() {
    d, err := bbolt.Open("test_journal.db", 0600, nil)
    if err != nil {
        t.Fatal(err)
    }
    db = d

    err = db.Update(func(tx *bbolt.Tx) error {
        _, err := tx.CreateBucketIfNotExists([]byte("Journal"))
        return err
    })
    if err != nil {
        t.Fatal(err)
    }

    return func() {
        db.Close()
        os.Remove("test_journal.db")
    }
}

// mockScanner creates a scanner that reads from a string
func mockScanner(input string) *bufio.Scanner {
    return bufio.NewScanner(strings.NewReader(input))
}

// TestWriteJournal verifies that journal entries are saved to the database
func TestWriteJournal(t *testing.T) {
    teardown := setup(t)
    defer teardown()

    scanner := mockScanner("Today was a great day!")
    WriteJournal(scanner) // ✅ This should now work!

    var storedEntry []byte
    db.View(func(tx *bbolt.Tx) error {
        b := tx.Bucket([]byte("Journal"))
        cursor := b.Cursor()
        for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
            storedEntry = v
            break
        }
        return nil
    })

    if string(storedEntry) != "Today was a great day!" {
        t.Errorf("Expected 'Today was a great day!', got '%s'", storedEntry)
    }
}