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

type CreditUsage struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	JobID     string    `gorm:"type:varchar(255);not null;index" json:"job_id"`
	JobTitle  string    `gorm:"type:varchar(255);not null" json:"job_title"`
	Reason    string    `gorm:"type:varchar(255);not null" json:"reason"`
	Credit    int       `gorm:"not null" json:"credit"`
	Refunded  bool      `gorm:"default:false" json:"refunded"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

type CreditRefundRequest struct {
	ID            string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID        string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	CreditUsageID string    `gorm:"type:varchar(255);not null;index" json:"credit_usage_id"`
	UserReason    string    `gorm:"type:varchar(255);not null" json:"user_reason"`
	AdminReason   string    `gorm:"type:varchar(255);not null" json:"admin_reason"`
	Status        string    `gorm:"type:varchar(255);not null;default:'pending';check:status IN ('pending', 'approved', 'rejected')" json:"status"`
	JobTitle      string    `gorm:"type:varchar(255);not null" json:"job_title"`
	CreatedAt     time.Time `gorm:"default:current_timestamp" json:"created_at"`
}
