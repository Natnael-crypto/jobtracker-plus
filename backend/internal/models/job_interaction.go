package models

import (
	"time"
)

// JobBid represents a bid placed by a user on a job.
type JobBid struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID     string    `gorm:"type:varchar(255);not null" json:"job_id"`
	UserID    string    `gorm:"type:varchar(255);not null" json:"user_id"`
	Status    string    `gorm:"type:varchar(20);default:'pending';check:status IN ('pending','shortlisted','hired','rejected','withdrawn','completed')" json:"status"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

type BidStats struct {
	Shortlisted int `json:"shortlisted"`
	Hired       int `json:"hired"`
	Rejected    int `json:"rejected"`
	Withdrawn   int `json:"withdrawn"`
	Completed   int `json:"completed"`
	Pending     int `json:"pending"`
	Total       int `json:"total"`
}

// JobInvitation represents an invitation sent from a client to a business for a job.
type JobInvitation struct {
	ID         string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID      string    `gorm:"type:varchar(255);not null" json:"job_id"`
	BusinessID string    `gorm:"type:varchar(255);not null" json:"business_id"`
	Status     string    `gorm:"type:varchar(20);default:'pending';check:status IN ('pending','accepted','hired','rejected','withdrawn','completed')" json:"status"`
	CreatedAt  time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// // JobAssignment represents a job officially assigned to a business.
// type JobAssignment struct {
// 	ID         string    `gorm:"type:varchar(255);primaryKey" json:"id"`
// 	JobID      string    `gorm:"type:varchar(255);not null" json:"job_id"`
// 	BusinessID string    `gorm:"type:varchar(255);not null" json:"business_id"`
// 	AssignedAt time.Time `gorm:"default:current_timestamp" json:"assigned_at"`

// 	// Enforce uniqueness on job_id + business_id
// 	// gorm:"uniqueIndex:idx_job_assignment"
// }
