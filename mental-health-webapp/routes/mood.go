package routes

import (
	"database/sql"
	"log"
	"mental-health-webapp/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetMoods(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		// Query only moods for the authenticated user
		query := "SELECT id, user_id, mood, note, created_at FROM moods WHERE user_id = $1 ORDER BY created_at DESC"
		rows, err := db.Query(query, userID)
		if err != nil {
			log.Printf("DB error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch moods"})
		}
		defer rows.Close()

		var moods []models.Mood
		for rows.Next() {
			var m models.Mood
			if err := rows.Scan(&m.ID, &m.UserID, &m.Mood, &m.Note, &m.CreatedAt); err != nil {
				log.Printf("Scan error: %v", err)
				return c.Status(500).JSON(fiber.Map{"error": "Failed to parse mood"})
			}
			moods = append(moods, m)
		}

		if len(moods) == 0 {
			return c.JSON([]models.Mood{})
		}
		return c.JSON(moods)
	}
}

// CreateMood creates a new mood entry for the authenticated user
func CreateMood(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		type Request struct {
			Mood string `json:"mood" validate:"required,max=50"`
			Note string `json:"note" validate:"max=500"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Validate mood values
		validMoods := map[string]bool{
			"happy":   true,
			"sad":     true,
			"anxious": true,
			"calm":    true,
			"angry":   true,
			"excited": true,
			"tired":   true,
			"neutral": true,
		}

		if !validMoods[req.Mood] {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid mood. Valid options: happy, sad, anxious, calm, angry, excited, tired, neutral",
			})
		}

		// Insert mood with parameterized query
		query := `INSERT INTO moods (user_id, mood, note, created_at) VALUES ($1, $2, $3, $4) RETURNING id`
		var id int
		err := db.QueryRow(query, userID, req.Mood, req.Note, time.Now()).Scan(&id)
		if err != nil {
			log.Printf("Insert error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to save mood"})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "Mood logged successfully",
			"id":      id,
			"mood":    req.Mood,
			"note":    req.Note,
		})
	}
}
