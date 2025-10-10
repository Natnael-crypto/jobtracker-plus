package models

import (
	"time"
)

// Quotation represents a job quotation created by a user.
type Quotation struct {
	ID                 string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID              string    `gorm:"type:varchar(255);not null;index" json:"job_id"`
	UserID             string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Discount           float64   `gorm:"type:numeric(12,2);not null" json:"discount"`
	Tax                float64   `gorm:"type:numeric(12,2);not null" json:"tax"`
	Total              float64   `gorm:"type:numeric(12,2);not null" json:"total"`
	TermsAndConditions string    `gorm:"type:text" json:"terms_and_conditions,omitempty"`
	Street             string    `gorm:"type:varchar(255)" json:"street,omitempty"`
	City               string    `gorm:"type:varchar(255)" json:"city,omitempty"`
	State              string    `gorm:"type:varchar(255)" json:"state,omitempty"`
	Country            string    `gorm:"type:varchar(255)" json:"country,omitempty"`
	Phone              string    `gorm:"type:varchar(20)" json:"phone,omitempty"`
	Email              string    `gorm:"type:varchar(255)" json:"email,omitempty"`
	LogoUrl            string    `gorm:"type:varchar(255)" json:"logo_url,omitempty"`
	JobTitle           string    `gorm:"type:varchar(255)" json:"job_title,omitempty"`
	Status             string    `gorm:"type:varchar(20);not null;check:status IN ('rejected','accepted','in_progress')" json:"status"`
	CreatedAt          time.Time `gorm:"default:current_timestamp" json:"created_at"`
}

// Invoice represents an invoice issued for a job.
type Invoice struct {
	ID                 string    `gorm:"type:varchar(255);primaryKey" json:"id"`
	JobID              string    `gorm:"type:varchar(255);not null;index" json:"job_id"`
	UserID             string    `gorm:"type:varchar(255);not null;index" json:"user_id"`
	Status             string    `gorm:"type:varchar(20);not null;check:status IN ('paid','overdue','in_progress')" json:"status"`
	Discount           float64   `gorm:"type:numeric(12,2);not null" json:"discount"`
	Tax                float64   `gorm:"type:numeric(12,2);not null" json:"tax"`
	Total              float64   `gorm:"type:numeric(12,2);not null" json:"total"`
	TermsAndConditions string    `gorm:"type:text" json:"terms_and_conditions,omitempty"`
	BankAccountName    string    `gorm:"type:varchar(255)" json:"bank_account_name,omitempty"`
	BankAccountNumber  string    `gorm:"type:varchar(50)" json:"bank_account_number,omitempty"`
	BankName           string    `gorm:"type:varchar(255)" json:"bank_name,omitempty"`
	SortCode           string    `gorm:"type:varchar(50)" json:"sort_code,omitempty"`
	BankRoutingNumber  string    `gorm:"type:varchar(50)" json:"bank_routing_number,omitempty"`
	CreatedAt          time.Time `gorm:"default:current_timestamp" json:"created_at"`
	DueDate            time.Time `gorm:"not null" json:"due_date"`
	Street             string    `gorm:"type:varchar(255)" json:"street,omitempty"`
	City               string    `gorm:"type:varchar(255)" json:"city,omitempty"`
	State              string    `gorm:"type:varchar(255)" json:"state,omitempty"`
	Country            string    `gorm:"type:varchar(255)" json:"country,omitempty"`
	Phone              string    `gorm:"type:varchar(20)" json:"phone,omitempty"`
	Email              string    `gorm:"type:varchar(255)" json:"email,omitempty"`
	LogoUrl            string    `gorm:"type:varchar(255)" json:"logo_url,omitempty"`
	JobTitle           string    `gorm:"type:varchar(255)" json:"job_title,omitempty"`
}

// LineItem represents an item included in either a quotation or an invoice.
type LineItem struct {
	ID          string  `gorm:"type:varchar(255);primaryKey" json:"id"`
	ParentID    string  `gorm:"type:varchar(255);index" json:"parent_id,omitempty"`
	Type        string  `gorm:"type:varchar(255);index;check: type IN ('Invoice','Quotation')" json:"type"`
	Service     string  `gorm:"type:varchar(255);index" json:"service,omitempty"`
	Unit        int     `json:"unit,omitempty"`
	Quantity    int     `gorm:"check:quantity > 0" json:"quantity"`
	Rate        float64 `gorm:"type:numeric(12,2)" json:"rate,omitempty"`
	Total       float64 `gorm:"type:numeric(12,2)" json:"total,omitempty"`
	Description string  `gorm:"type:text" json:"description,omitempty"`
}

type LineItemRequest struct {
	Service     string  `gorm:"type:varchar(255);index" json:"service,omitempty"`
	Unit        int     `json:"unit,omitempty"`
	Quantity    int     `gorm:"check:quantity > 0" json:"quantity"`
	Rate        float64 `gorm:"type:numeric(12,2)" json:"rate,omitempty"`
	Total       float64 `gorm:"type:numeric(12,2)" json:"total,omitempty"`
	Description string  `gorm:"type:text" json:"description,omitempty"`
}
