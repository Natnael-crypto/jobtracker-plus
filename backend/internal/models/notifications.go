package models

import (
	"time"
)

type Notification struct {
	ID          string     `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID      string     `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Title       string     `gorm:"type:varchar(255);not null" json:"title"`
	Description string     `gorm:"type:text" json:"description,omitempty"`
	CreatedAt   time.Time  `gorm:"default:current_timestamp" json:"created_at"`
	ReadAt      *time.Time `json:"read_at,omitempty"`
}
