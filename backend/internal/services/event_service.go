package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"time"

	"github.com/google/uuid"
)

type EventService interface {
	Create(userID, title, startTime, endTime, description string, day time.Time, jobID *string) (*models.Event, error)
	Update(eventID, userID string, title, startTime, endTime, description string, day time.Time, jobID *string) (*models.Event, error)
	GetByDay(userID string, day string) ([]models.Event, error)
	Delete(eventID, userID string) error
}

type eventService struct {
	repo repositories.EventRepository
}

func NewEventService(repo repositories.EventRepository) EventService {
	return &eventService{repo: repo}
}

func (s *eventService) Create(userID, title, startTime, endTime, description string, day time.Time, jobID *string) (*models.Event, error) {
	if title == "" || startTime == "" || endTime == "" {
		return nil, errors.New("title, start_time, and end_time are required")
	}

	event := &models.Event{
		ID:          uuid.NewString(),
		UserID:      userID,
		Title:       title,
		Day:         day,
		StartTime:   startTime,
		EndTime:     endTime,
		Description: description,
		JobID:       jobID,
		CreatedAt:   time.Now(),
	}

	if err := s.repo.Create(event); err != nil {
		return nil, err
	}
	return event, nil
}

func (s *eventService) Update(eventID, userID string, title, startTime, endTime, description string, day time.Time, jobID *string) (*models.Event, error) {
	event, err := s.repo.GetByID(eventID)
	if err != nil {
		return nil, err
	}
	if event.UserID != userID {
		return nil, errors.New("unauthorized")
	}
	if title != "" {
		event.Title = title
	}
	if startTime != "" {
		event.StartTime = startTime
	}
	if endTime != "" {
		event.EndTime = endTime
	}
	if description != "" {
		event.Description = description
	}
	if day != (time.Time{}) {
		event.Day = day
	}
	if jobID != nil {
		event.JobID = jobID
	}

	if err := s.repo.Update(event); err != nil {
		return nil, err
	}
	return event, nil
}

func (s *eventService) GetByDay(userID string, day string) ([]models.Event, error) {
	return s.repo.GetByDay(userID, day)
}

func (s *eventService) Delete(eventID, userID string) error {
	event, err := s.repo.GetByID(eventID)
	if err != nil {
		return err
	}
	if event.UserID != userID {
		return errors.New("unauthorized")
	}
	return s.repo.Delete(eventID)
}
