// main.go
package main

import (
    "bufio"
    "fmt"
    "os"

    "mental-health-cli/internal/repository"
)

func main() {
    // Load config
    cfg, err := repository.LoadConfig()
    if err != nil {
        fmt.Println("Failed to load config:", err)
        os.Exit(1)
    }

    // Print active DB file (optional)
    fmt.Printf("Using DB: %s\n", cfg.DBFile)

    // Initialize DB
    repository.InitDB()
    defer repository.CloseDB()

    scanner := bufio.NewScanner(os.Stdin)

    for {
        fmt.Println("\nChoose an option:")
        fmt.Println("1. Log Mood")
        fmt.Println("2. Write Journal")
        fmt.Println("3. Talk to AI")
        fmt.Println("4. View Mood History")
        fmt.Println("5. Exit")
        fmt.Print(">> ")

        scanner.Scan()
        choice := scanner.Text()

        switch choice {
        case "1":
            repository.LogMood(scanner)
        case "2":
            repository.WriteJournal(scanner)
        case "3":
            repository.StartChat(scanner)
        case "4":
            repository.ViewMoodHistory()
        case "5":
            fmt.Println("Goodbye 👋")
            return
        default:
            fmt.Println("Invalid choice. Try again.")
        }
    }
}