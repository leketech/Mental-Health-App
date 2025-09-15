// middleware/security.go
package middleware

import (
	"log"
	"regexp"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// SecurityMiddleware creates a middleware to block malicious requests
func SecurityMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get the request URL and query parameters
		url := c.OriginalURL()
		query := c.Queries()

		// Log the request for monitoring
		log.Printf("🔍 Security check for request: %s", url)

		// Check for SQL injection patterns
		sqlPatterns := []string{
			`(?i)union\s+select`, `(?i)drop\s+table`, `(?i)delete\s+from`,
			`(?i)insert\s+into`, `(?i)update\s+\w+\s+set`, `(?i)~and~`,
			`;.*(--|#)`, `/\*.*\*/`, `(?i)exec\s*\(`,
		}

		// Check for XSS patterns
		xssPatterns := []string{
			`(?i)<script`, `(?i)javascript:`, `(?i)onload\s*=`,
			`(?i)onerror\s*=`, `(?i)onclick\s*=`, `(?i)onmouseover\s*=`,
			`(?i)eval\s*\(`, `(?i)document\.cookie`,
		}

		// Combine all patterns
		maliciousPatterns := append(sqlPatterns, xssPatterns...)

		// Check URL path
		for _, pattern := range maliciousPatterns {
			matched, err := regexp.MatchString(pattern, url)
			if err != nil {
				log.Printf("⚠️ Error checking pattern: %v", err)
				continue
			}
			if matched {
				log.Printf("🚨 Blocked malicious URL pattern: %s (pattern: %s)", url, pattern)
				return c.Status(400).JSON(fiber.Map{
					"error": "Invalid request",
					"message": "Request contains malicious patterns",
				})
			}
		}

		// Check query parameters
		for key, values := range query {
			for _, value := range values {
				// Convert value to string properly
				valueStr := fmt.Sprintf("%v", value)
				fullParam := key + "=" + valueStr
				
				// Check for excessively long parameters
				if len(fullParam) > 200 {
					log.Printf("🚨 Blocked excessively long parameter: %s", fullParam)
					return c.Status(400).JSON(fiber.Map{
						"error": "Invalid request",
						"message": "Request contains excessively long parameters",
					})
				}
				
				// Check for malicious patterns in parameters
				for _, pattern := range maliciousPatterns {
					matched, err := regexp.MatchString(pattern, fullParam)
					if err != nil {
						log.Printf("⚠️ Error checking pattern: %v", err)
						continue
					}
					if matched {
						log.Printf("🚨 Blocked malicious parameter: %s (pattern: %s)", fullParam, pattern)
						return c.Status(400).JSON(fiber.Map{
							"error": "Invalid request",
							"message": "Request contains malicious patterns",
						})
					}
				}
				
				// Check for excessive repetition of characters
				if regexp.MustCompile(`(.)\1{10,}`).MatchString(valueStr) {
					log.Printf("🚨 Blocked parameter with excessive repetition: %s", valueStr)
					return c.Status(400).JSON(fiber.Map{
						"error": "Invalid request",
						"message": "Request contains invalid parameters",
					})
				}
			}
		}

		// Continue to next middleware/handler
		return c.Next()
	}
}