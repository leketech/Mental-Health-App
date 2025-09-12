// internal/repository/chat.go
package repository

import (
    "bufio"
    "fmt"
    "strings"
)

// StartChat starts a simple conversational loop with the user
func StartChat(scanner *bufio.Scanner) {
    fmt.Println("You can start chatting. Type 'bye' to exit chat.")

    for {
        fmt.Print("You: ")
        scanner.Scan()
        input := scanner.Text()
        if strings.ToLower(input) == "bye" {
            fmt.Println("AI: Take care! 😊")
            break
        }

        response := GenerateResponse(input)
        fmt.Println("AI:", response)
    }
}

// GenerateResponse provides a simple rule-based response to user input
func GenerateResponse(input string) string {
    lower := strings.ToLower(input)
    if containsAny(lower, []string{"sad", "down", "bad", "low"}) {
        return "I'm sorry you're feeling that way. Would you like to journal about it?"
    } else if containsAny(lower, []string{"happy", "great", "good", "awesome"}) {
        return "That's wonderful! I'm glad to hear it!"
    }
    return "Thanks for sharing. I'm here to listen anytime."
}

// containsAny checks if any of the substrings exist in the input string
func containsAny(s string, substrs []string) bool {
    for _, sub := range substrs {
        if strings.Contains(s, sub) {
            return true
        }
    }
    return false
}