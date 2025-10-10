package repositories

import (
	"backend/internal/models"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type EventRepository interface {
	Create(event *models.Event) error
	Update(event *models.Event) error
	GetByDay(userID string, day string) ([]models.Event, error)
	GetByID(id string) (*models.Event, error)
	Delete(id string) error
}

type eventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) EventRepository {
	return &eventRepository{db: db}
}

func (r *eventRepository) Create(event *models.Event) error {
	return r.db.Create(event).Error
}

func (r *eventRepository) Update(event *models.Event) error {
	return r.db.Save(event).Error
}

func (r *eventRepository) GetByDay(userID string, day string) ([]models.Event, error) {
	var parsedDay time.Time
	var err error

	// Try parsing with datetime (dd/mm/yyyy, HH:MM:SS)
	parsedDay, err = time.Parse("02/01/2006, 15:04:05", day)
	if err != nil {
		// If that fails, try just date (dd/mm/yyyy)
		parsedDay, err = time.Parse("02/01/2006", day)
		if err != nil {
			return nil, fmt.Errorf("invalid date format: %v", err)
		}
	}

	// Normalize to YYYY-MM-DD (Postgres DATE)
	formattedDay := parsedDay.Format("2006-01-02")

	var events []models.Event
	if err := r.db.Where("user_id = ? AND day = ?", userID, formattedDay).Find(&events).Error; err != nil {
		return nil, err
	}
	return events, nil
}

func (r *eventRepository) GetByID(id string) (*models.Event, error) {
	var event models.Event
	if err := r.db.First(&event, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *eventRepository) Delete(id string) error {
	return r.db.Unscoped().Delete(&models.Event{}, "id = ?", id).Error
}
