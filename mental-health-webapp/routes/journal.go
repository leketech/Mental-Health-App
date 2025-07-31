package routes

import (
    "database/sql"
    "mental-health-webapp/models"
    "github.com/gofiber/fiber/v2"
    "log"
    "time"
)

func GetJournals(db *sql.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        query := "SELECT id, user_id, title, body, created_at FROM journals ORDER BY created_at DESC"
        rows, err := db.Query(query)
        if err != nil {
            log.Printf("DB error: %v", err)
            return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch journals"})
        }
        defer rows.Close()

        var journals []models.Journal
        for rows.Next() {
            var j models.Journal
            if err := rows.Scan(&j.ID, &j.UserID, &j.Title, &j.Body, &j.CreatedAt); err != nil {
                log.Printf("Scan error: %v", err)
                return c.Status(500).JSON(fiber.Map{"error": "Failed to parse journal"})
            }
            journals = append(journals, j)
        }

        if len(journals) == 0 {
            return c.JSON([]models.Journal{})
        }
        return c.JSON(journals)
    }
}

func CreateJournal(db *sql.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        type Request struct {
            UserID int    `json:"user_id" validate:"required"`
            Title  string `json:"title" validate:"required,max=100"`
            Body   string `json:"body" validate:"required"`
        }

        var req Request
        if err := c.BodyParser(&req); err != nil {
            return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
        }

        query := `INSERT INTO journals (user_id, title, body, created_at) VALUES ($1, $2, $3, $4) RETURNING id`
        var id int
        err := db.QueryRow(query, req.UserID, req.Title, req.Body, time.Now()).Scan(&id)
        if err != nil {
            log.Printf("Insert error: %v", err)
            return c.Status(500).JSON(fiber.Map{"error": "Failed to save journal"})
        }

        return c.Status(201).JSON(fiber.Map{
            "message": "Journal entry created",
            "id":      id,
        })
    }
}