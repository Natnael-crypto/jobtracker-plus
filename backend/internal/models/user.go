package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents the users table.
type User struct {
	ID           string         `gorm:"type:varchar(255);primaryKey" json:"id"`
	Role         string         `gorm:"type:varchar(20);not null;index;check:role IN ('client','business','admin')" json:"role"`
	Email        string         `gorm:"type:varchar(255);unique;not null;index" json:"email"`
	PasswordHash string         `gorm:"type:text;not null" json:"password_hash,omitempty"`
	Status       string         `gorm:"type:varchar(20);not null;default:'active'" json:"status"`
	CreatedAt    time.Time      `gorm:"default:current_timestamp" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// UserProfile corresponds to user_profiles table.
type UserProfile struct {
	ID        string         `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID    string         `gorm:"type:varchar(255);not null;index" json:"user_id"`
	FirstName string         `gorm:"type:varchar(100)" json:"first_name"`
	LastName  string         `gorm:"type:varchar(100)" json:"last_name"`
	Phone     string         `gorm:"type:varchar(20)" json:"phone_number"`
	ImageURL  string         `gorm:"type:text" json:"image_url,omitempty"`
	AddressID *string        `gorm:"type:varchar(255)" json:"address_id,omitempty"`
	CreatedAt time.Time      `gorm:"default:current_timestamp" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// UserToken stores arbitrary tokens (password reset, email confirm, etc.).
type UserToken struct {
	ID        string         `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID    string         `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Type      string         `gorm:"type:varchar(50);not null;check:type IN ('email','password')" json:"type"`
	Token     string         `gorm:"type:text;not null;unique" json:"token"`
	ExpiresAt time.Time      `gorm:"not null" json:"expires_at"`
	Trail     int            `gorm:"default:0" json:"trail"`
	CreatedAt time.Time      `gorm:"default:current_timestamp" json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

type UserAddress struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Street    string    `gorm:"type:varchar(255)" json:"street"`
	City      string    `gorm:"type:varchar(100)" json:"city"`
	State     string    `gorm:"type:varchar(100)" json:"state"`
	Zip       string    `gorm:"type:varchar(20)" json:"zip"`
	Country   string    `gorm:"type:varchar(100)" json:"country"`
	Longitude float64   `gorm:"type:decimal(9,6)" json:"longitude"`
	Latitude  float64   `gorm:"type:decimal(9,6)" json:"latitude"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

type UserVerification struct {
	ID        string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Type      string    `gorm:"type:varchar(50);not null;check:type IN ('email','identity')" json:"type"`
	Verified  bool      `gorm:"default:false" json:"verified"`
	CreatedAt time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

type UserProfileWithRating struct {
	UserProfile
	AverageRating float64 `json:"average_rating"`
	ReviewCount   int     `json:"review_count"`
}

type UserProfileResponse struct {
	UserProfile          *UserProfile          `json:"user_profile,omitempty"`
	Reviews              []Review              `json:"reviews,omitempty"`
	AverageRate          float64               `json:"average_rate"`
	Services             []Service             `json:"services,omitempty"`
	Qualifications       []Qualification       `json:"qualifications,omitempty"`
	Education            []Qualification       `json:"education,omitempty"`
	Awards               []Qualification       `json:"awards,omitempty"`
	Portfolio            []Portfolio           `json:"portfolio,omitempty"`
	BusinessIntroduction *BusinessIntroduction `json:"business_introduction,omitempty"`
}
