package routes

import (
    "database/sql"
    "mental-health-webapp/models"
    "github.com/gofiber/fiber/v2"
    "log"
)

func GetMoods(db *sql.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        query := "SELECT id, user_id, mood, note, created_at FROM moods ORDER BY created_at DESC"
        rows, err := db.Query(query)
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