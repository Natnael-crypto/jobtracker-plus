package models

import (
	"time"
)

// Message represents a message sent by a user regarding a job.
type Message struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID     string    `gorm:"type:varchar(255);not null;index" json:"job_id"`
	UserID    string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Message   string    `gorm:"type:text;not null" json:"message"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// Review represents a review given for a job.
type Review struct {
	ID         string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID      string    `gorm:"type:varchar(255);not null;index" json:"job_id"`
	ReviewerID string    `gorm:"type:varchar(255);not null;index" json:"reviewer_id"`
	UserID     string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Rate       int       `gorm:"check:rate BETWEEN 1 AND 5" json:"rate,omitempty"`
	Comment    string    `gorm:"type:text" json:"comment,omitempty"`
	CreatedAt  time.Time `gorm:"default:current_timestamp" json:"created_at"`
}
