package models

import (
	"time"
)

// Credit represents a user's credit balance.
type Credit struct {
	ID               string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID           string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	TotalCredits     int       `gorm:"default:0" json:"total_credits"`
	AvailableCredits int       `gorm:"default:0" json:"available_credits"`
	UpdatedAt        time.Time `gorm:"default:current_timestamp" json:"updated_at"`
}

// CreditHistory records credit changes for a user, optionally linked to a job.
type CreditHistory struct {
	ID           string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID        *string   `gorm:"type:varchar(255);index" json:"job_id,omitempty"`
	UserID       string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	CreditChange int       `gorm:"not null" json:"credit_change"`
	CreatedAt    time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// CreditPurchase represents a purchase of credits by a user.
type CreditPurchase struct {
	ID         string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID     string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	StripeID   string    `gorm:"type:varchar(255)" json:"stripe_id,omitempty"`
	Credits    int       `gorm:"not null" json:"credits"`
	PaidAmount float64   `gorm:"type:numeric(12,2);not null" json:"paid_amount"`
	CreatedAt  time.Time `gorm:"default:current_timestamp" json:"created_at"`
}
