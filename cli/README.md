# Mental Health CLI Application

This directory contains the command-line interface (CLI) version of the Mental Health application.

## Contents

- `main.go` - Main CLI application entry point
- `internal/` - Internal packages for CLI functionality
  - `repository/` - Database and data access layer
    - `chat.go` - AI chat functionality
    - `config.go` - Configuration management
    - `db.go` - Database initialization and management
    - `journal.go` - Journal entry management
    - `mood.go` - Mood logging functionality
    - `*_test.go` - Unit tests
- `go.mod` - Go module file
- `go.sum` - Go module dependencies
- `mental_health.db` - SQLite database file

## Usage

To run the CLI application:

```bash
cd cli
go run main.go
```

## Features

The CLI provides the following features:
1. Log Mood - Record your current mood
2. Write Journal - Create journal entries
3. Talk to AI - Chat with AI assistant
4. View Mood History - View your mood tracking history
5. Exit - Close the application

## Note

This CLI application is separate from the web application deployment and will not interfere with the web service deployment process.