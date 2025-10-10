package models

import (
	"time"

	"gorm.io/gorm"
)

// Job represents a job posting.
type Job struct {
	ID              string         `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID          string         `gorm:"type:varchar(255);not null;index" json:"user_id"`
	ServiceCategory string         `gorm:"type:varchar(255);not null" json:"service_category"`
	ServiceSpecific string         `gorm:"type:varchar(255)" json:"service_specific,omitempty"`
	Time            string         `json:"type:varchar(255),omitempty"`
	Budget          string         `gorm:"type:varchar(255)" json:"budget,omitempty"`
	Description     string         `gorm:"type:text" json:"description,omitempty"`
	Headline        string         `gorm:"type:varchar(255)" json:"headline,omitempty"`
	Status          string         `gorm:"type:varchar(20);not null;default:'open';check:status IN ('open','closed','awarded')" json:"status"`
	CreatedAt       time.Time      `gorm:"default:current_timestamp" json:"created_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// JobAddress stores job-specific address details.
type JobAddress struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID     string    `gorm:"type:varchar(255);not null;index" json:"job_id"`
	Street    string    `gorm:"type:varchar(255)" json:"street"`
	City      string    `gorm:"type:varchar(100)" json:"city"`
	State     string    `gorm:"type:varchar(100)" json:"state"`
	Zip       string    `gorm:"type:varchar(20)" json:"zip"`
	Country   string    `gorm:"type:varchar(100)" json:"country"`
	Longitude float64   `gorm:"type:decimal(9,6)" json:"longitude"`
	Latitude  float64   `gorm:"type:decimal(9,6)" json:"latitude"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// JobImage stores images linked to a job.
type JobImage struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID     string    `gorm:"type:varchar(255);not null;index" json:"job_id"`
	ImageURL  string    `gorm:"type:text;not null" json:"image_url"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// Event represents a user’s calendar event linked optionally to a job.
type Event struct {
	ID          string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID      string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Day         time.Time `gorm:"type:date;not null" json:"day"`
	StartTime   string    `gorm:"type:varchar(8);not null" json:"start_time"`
	EndTime     string    `gorm:"type:varchar(8);not null" json:"end_time"`
	Description string    `gorm:"type:text" json:"description,omitempty"`
	JobID       *string   `gorm:"type:varchar(255)" json:"job_id,omitempty"`
	CreatedAt   time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

type AddressRequest struct {
	Label       string `json:"label,omitempty"`
	City        string `json:"city,omitempty"`
	State       string `json:"state,omitempty"`
	CountryCode string `json:"countryCode,omitempty"`
	CountryName string `json:"countryName,omitempty"`
	County      string `json:"county,omitempty"`
	PostalCode  string `json:"postalCode,omitempty"`
}
