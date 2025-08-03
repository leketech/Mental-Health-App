package routes

import (
	"database/sql"
	"log"

	"github.com/gofiber/fiber/v2"
)

// GetUserProfile returns the profile of the authenticated user
func GetUserProfile(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		// For now, return mock user data since we don't have a users table
		// In a real application, you would query the users table
		query := `SELECT COUNT(*) as mood_count FROM moods WHERE user_id = $1`
		var moodCount int
		err := db.QueryRow(query, userID).Scan(&moodCount)
		if err != nil {
			log.Printf("Mood count query error: %v", err)
			moodCount = 0
		}

		query = `SELECT COUNT(*) as journal_count FROM journals WHERE user_id = $1`
		var journalCount int
		err = db.QueryRow(query, userID).Scan(&journalCount)
		if err != nil {
			log.Printf("Journal count query error: %v", err)
			journalCount = 0
		}

		// Return user profile with statistics
		return c.JSON(fiber.Map{
			"user_id":         userID,
			"name":            "User",             // Mock data - in real app, get from users table
			"email":           "user@example.com", // Mock data
			"mood_entries":    moodCount,
			"journal_entries": journalCount,
			"member_since":    "2025-01-01", // Mock data
		})
	}
}

// GetUserStats returns detailed statistics for the authenticated user
func GetUserStats(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get user ID from JWT context
		userID, ok := c.Locals("userID").(int)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: invalid user context"})
		}

		// Get mood statistics
		moodQuery := `
			SELECT mood, COUNT(*) as count 
			FROM moods 
			WHERE user_id = $1 
			GROUP BY mood 
			ORDER BY count DESC
		`
		rows, err := db.Query(moodQuery, userID)
		if err != nil {
			log.Printf("Mood stats query error: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch mood statistics"})
		}
		defer rows.Close()

		moodStats := make(map[string]int)
		for rows.Next() {
			var mood string
			var count int
			if err := rows.Scan(&mood, &count); err != nil {
				log.Printf("Mood stats scan error: %v", err)
				continue
			}
			moodStats[mood] = count
		}

		// Get recent activity (last 7 days)
		recentQuery := `
			SELECT DATE(created_at) as date, COUNT(*) as entries
			FROM (
				SELECT created_at FROM moods WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
				UNION ALL
				SELECT created_at FROM journals WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
			) as combined
			GROUP BY DATE(created_at)
			ORDER BY date DESC
		`

		recentRows, err := db.Query(recentQuery, userID)
		if err != nil {
			log.Printf("Recent activity query error: %v", err)
			// Continue without recent activity data
		}
		defer recentRows.Close()

		recentActivity := make([]map[string]interface{}, 0)
		if recentRows != nil {
			for recentRows.Next() {
				var date string
				var entries int
				if err := recentRows.Scan(&date, &entries); err != nil {
					log.Printf("Recent activity scan error: %v", err)
					continue
				}
				recentActivity = append(recentActivity, map[string]interface{}{
					"date":    date,
					"entries": entries,
				})
			}
		}

		return c.JSON(fiber.Map{
			"user_id":         userID,
			"mood_statistics": moodStats,
			"recent_activity": recentActivity,
		})
	}
}
