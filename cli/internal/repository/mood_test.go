// mood_test.go
package repository

import (
    "os"
    "strings"
    "testing"

    "go.etcd.io/bbolt"
)

var testDB *bbolt.DB

// Setup opens a test database before tests and tears it down after
func setupMoodTestDB(t *testing.T) func() {
    // Create a temporary DB
    db, err := bbolt.Open("test_mood.db", 0600, nil)
    if err != nil {
        t.Fatal(err)
    }

    // Create the Mood bucket
    err = db.Update(func(tx *bbolt.Tx) error {
        _, err := tx.CreateBucketIfNotExists([]byte("Mood"))
        return err
    })
    if err != nil {
        t.Fatal(err)
    }

    testDB = db

    // Return a teardown function
    return func() {
        testDB.Close()
        os.Remove("test_mood.db")
    }
}

// mockScanner is now defined in test_utils.go for reuse across tests

// TestLogMood verifies that a mood can be written to the DB
func TestLogMood(t *testing.T) {
    teardown := setupMoodTestDB(t)
    defer teardown()

    // Simulate user input
    scanner := mockScanner("happy")

    // Call the function to test
    LogMood(scanner)

    // Verify the data was written
    var mood []byte
    testDB.View(func(tx *bbolt.Tx) error {
        b := tx.Bucket([]byte("Mood"))
        cursor := b.Cursor()
        for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
            mood = v
            break
        }
        return nil
    })

    if string(mood) != "happy" {
        t.Errorf("Expected mood 'happy', got '%s'", mood)
    }
}

// TestViewMoodHistory verifies that stored moods can be read and printed
func TestViewMoodHistory(t *testing.T) {
    teardown := setupMoodTestDB(t)
    defer teardown()

    // Insert test data
    testDB.Update(func(tx *bbolt.Tx) error {
        b := tx.Bucket([]byte("Mood"))
        return b.Put([]byte("2025-04-05"), []byte("sad"))
    })

    // Capture output of ViewMoodHistory
    originalStdout := os.Stdout
    r, w, _ := os.Pipe()
    os.Stdout = w

    ViewMoodHistory()

    w.Close()
    os.Stdout = originalStdout

    out, _ := os.ReadFile(r.Name())
    output := string(out)

    if !strings.Contains(output, "2025-04-05 - sad") {
        t.Errorf("Expected output to contain '2025-04-05 - sad', got:\n%s", output)
    }
}