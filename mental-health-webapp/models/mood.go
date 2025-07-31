package models

import "time"

type Mood struct {
    ID         int       `json:"id"`
    UserID     int       `json:"user_id"`
    Mood       string    `json:"mood"`
    Note       string    `json:"note"`
    CreatedAt  time.Time `json:"created_at"`
}