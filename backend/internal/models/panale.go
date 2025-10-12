package models

import (
	"time"
)

type Question struct {
	ID          string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID      string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Content     string    `gorm:"type:text" json:"content,omitempty"`
	CreatedAt   time.Time `gorm:"default:current_timestamp" json:"created_at"`
	Category    string    `gorm:"type:varchar(100);not null" json:"category"`
	FirstName   string    `gorm:"type:varchar(100)" json:"first_name"`
	AnswerCount int       `gorm:"default:0" json:"answer_count"`
}

type Answer struct {
	ID         string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	QuestionID string    `gorm:"type:varchar(255);not null;index" json:"question_id"`
	UserID     string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Content    string    `gorm:"type:text;not null" json:"content"`
	CreatedAt  time.Time `gorm:"default:current_timestamp" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	LikeCount  int       `gorm:"default:0" json:"like_count"`
	FullName   string    `gorm:"type:varchar(100)" json:"full_name"`
	ImageUrl   string    `gorm:"type:varchar(255)" json:"image_url"`
}

type LikeConstraint struct {
	AnswerID  string    `gorm:"type:varchar(255);not null;index:idx_answer_user,unique" json:"answer_id"`
	AnnoID    string    `gorm:"type:varchar(255);not null;index:idx_answer_user,unique" json:"anno_id"`
	Ip        string    `gorm:"type:varchar(45);not null" json:"ip"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}
