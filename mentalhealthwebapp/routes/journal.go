package routes

import (
	"database/sql"
	"log"
	"github.com/leketech/mental-health-app/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetJournals(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		// Query only journals for the authenticated user
		query := "SELECT id, user_id, title, body, created_at FROM journals WHERE user_id = $1 ORDER BY created_at DESC"
		rows, err := db.Query(query, userID)
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
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		type Request struct {
			Title string `json:"title" validate:"required,max=100"`
			Body  string `json:"body" validate:"required"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Validate input lengths
		if len(req.Title) > 100 {
			return c.Status(400).JSON(fiber.Map{"error": "Title must be 100 characters or less"})
		}
		if len(req.Body) > 5000 {
			return c.Status(400).JSON(fiber.Map{"error": "Body must be 5000 characters or less"})
		}

		query := `INSERT INTO journals (user_id, title, body, created_at) VALUES ($1, $2, $3, $4) RETURNING id`
		var id int
		err := db.QueryRow(query, userID, req.Title, req.Body, time.Now()).Scan(&id)
		if err != nil {
			log.Printf("Insert error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to save journal"})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "Journal entry created",
			"id":      id,
			"title":   req.Title,
		})
	}
}

// UpdateJournal updates an existing journal entry for the authenticated user
func UpdateJournal(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		// Get journal ID from URL parameter
		journalID := c.Params("id")
		if journalID == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Journal ID is required"})
		}

		type Request struct {
			Title string `json:"title" validate:"required,max=100"`
			Body  string `json:"body" validate:"required"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Validate input lengths
		if len(req.Title) > 100 {
			return c.Status(400).JSON(fiber.Map{"error": "Title must be 100 characters or less"})
		}
		if len(req.Body) > 5000 {
			return c.Status(400).JSON(fiber.Map{"error": "Body must be 5000 characters or less"})
		}

		// Update only if the journal belongs to the authenticated user
		query := `UPDATE journals SET title = $1, body = $2 WHERE id = $3 AND user_id = $4`
		result, err := db.Exec(query, req.Title, req.Body, journalID, userID)
		if err != nil {
			log.Printf("Update error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to update journal"})
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			log.Printf("RowsAffected error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to verify update"})
		}

		if rowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Journal not found or access denied"})
		}

		return c.JSON(fiber.Map{
			"message": "Journal updated successfully",
			"id":      journalID,
		})
	}
}

// DeleteJournal deletes a journal entry for the authenticated user
func DeleteJournal(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		// Get journal ID from URL parameter
		journalID := c.Params("id")
		if journalID == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Journal ID is required"})
		}

		// Delete only if the journal belongs to the authenticated user
		query := `DELETE FROM journals WHERE id = $1 AND user_id = $2`
		result, err := db.Exec(query, journalID, userID)
		if err != nil {
			log.Printf("Delete error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to delete journal"})
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			log.Printf("RowsAffected error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to verify deletion"})
		}

		if rowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Journal not found or access denied"})
		}

		return c.JSON(fiber.Map{
			"message": "Journal deleted successfully",
		})
	}
}
