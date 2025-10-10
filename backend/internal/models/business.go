package models

import (
	"time"

	"gorm.io/gorm"
)

// BusinessRange defines delivery/service range in kilometers.
type BusinessRange struct {
	ID        string         `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID    string         `gorm:"type:varchar(255);not null;index" json:"user_id"`
	RangeKm   int            `gorm:"not null;check:range_km > 0" json:"range_km"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// Service represents services offered by a business.
type Service struct {
	ID          string         `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID      string         `gorm:"type:varchar(255);not null;index" json:"user_id"`
	ServiceName string         `gorm:"type:varchar(255);not null" json:"service_name"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// Qualification defines user qualifications (education or award).
type Qualification struct {
	ID          string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID      string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Type        string    `gorm:"type:varchar(50);not null;check:type IN ('Education','Award')" json:"type"`
	Title       string    `gorm:"type:varchar(255)" json:"title,omitempty"`
	StartYear   int       `json:"start_year,omitempty"`
	EndYear     int       `json:"end_year,omitempty"`
	Institute   string    `gorm:"type:varchar(255)" json:"institute,omitempty"`
	Description string    `gorm:"type:text" json:"description,omitempty"`
	CreatedAt   time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// Portfolio stores user portfolio images.
type Portfolio struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	ImageURL  string    `gorm:"type:text;not null" json:"image_url"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// BusinessIntroduction represents a short introduction for a business.
type BusinessIntroduction struct {
	ID          string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID      string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Description string    `gorm:"type:text;not null" json:"description"`
	CreatedAt   time.Time `gorm:"default:current_timestamp" json:"created_at"`
}
