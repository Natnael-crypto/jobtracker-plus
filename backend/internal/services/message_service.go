package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"time"

	"github.com/google/uuid"
)

type MessageService struct {
	repo repositories.MessageRepository
}

func NewMessageService(repo repositories.MessageRepository) *MessageService {
	return &MessageService{repo: repo}
}

func (s *MessageService) Create(jobID, userID, text string) (*models.Message, error) {
	if text == "" {
		return nil, errors.New("message cannot be empty")
	}

	msg := &models.Message{
		ID:        uuid.NewString(),
		JobID:     jobID,
		UserID:    userID,
		Message:   text,
		CreatedAt: time.Now(),
	}

	if err := s.repo.Create(msg); err != nil {
		return nil, err
	}
	return msg, nil
}

func (s *MessageService) Update(msgID, userID, text string) (*models.Message, error) {
	msg, err := s.repo.GetByID(msgID)
	if err != nil {
		return nil, err
	}
	if msg.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	if text != "" {
		msg.Message = text
	}

	if err := s.repo.Update(msg); err != nil {
		return nil, err
	}
	return msg, nil
}

func (s *MessageService) Delete(msgID, userID string) error {
	msg, err := s.repo.GetByID(msgID)
	if err != nil {
		return err
	}
	if msg.UserID != userID {
		return errors.New("unauthorized")
	}
	return s.repo.Delete(msgID)
}

// Get full conversation flow, tagging messages as "me" or "other"
func (s *MessageService) GetConversation(jobID, requesterID string) ([]map[string]interface{}, error) {
	messages, err := s.repo.GetConversation(jobID)
	if err != nil {
		return nil, err
	}

	var conversation []map[string]interface{}
	for _, msg := range messages {
		role := "other"
		if msg.UserID == requesterID {
			role = "me"
		}
		conversation = append(conversation, map[string]interface{}{
			"id":         msg.ID,
			"user_id":    msg.UserID,
			"job_id":     msg.JobID,
			"message":    msg.Message,
			"created_at": msg.CreatedAt,
			"sender":     role,
		})
	}

	return conversation, nil
}
