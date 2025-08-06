// routes/chat.go
package routes

import (
    "os"

    "github.com/gofiber/fiber/v2"
    openai "github.com/sashabaranov/go-openai"
)

func ChatHandler(c *fiber.Ctx) error {
    type Request struct {
        Message string `json:"message" validate:"required"`
    }

    var req Request
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
    }

    client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
    resp, err := client.CreateChatCompletion(c.Context(), openai.ChatCompletionRequest{
        Model: openai.GPT3Dot5Turbo,
        Messages: []openai.ChatCompletionMessage{
            {
                Role:    openai.ChatMessageRoleSystem,
                Content: "You are a compassionate mental health assistant. Respond kindly.",
            },
            {
                Role:    openai.ChatMessageRoleUser,
                Content: req.Message,
            },
        },
        MaxTokens: 150,
    })
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "AI request failed"})
    }

    return c.JSON(fiber.Map{
        "reply": resp.Choices[0].Message.Content,
    })
}