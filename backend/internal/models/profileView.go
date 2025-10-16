package models

import "time"

type ProfileView struct {
	UserID    string    `grom:"type:varchar(255);primaryKey" json:"user_id"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}
