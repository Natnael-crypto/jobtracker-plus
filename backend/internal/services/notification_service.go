package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

type NotificationService struct {
	repo repositories.NotificationRepository
}

func NewNotificationService(repo repositories.NotificationRepository) *NotificationService {
	return &NotificationService{repo: repo}
}

func (s *NotificationService) Create(ctx context.Context, userID, title, description string) (*models.Notification, error) {
	if userID == "" || title == "" {
		return nil, errors.New("userID and title are required")
	}

	notif := &models.Notification{
		ID:          "notif_" + uuid.NewString(),
		UserID:      userID,
		Title:       title,
		Description: description,
		CreatedAt:   time.Now(),
	}

	if err := s.repo.Create(ctx, notif); err != nil {
		return nil, err
	}
	return notif, nil
}

func (s *NotificationService) GetByUser(ctx context.Context, userID string, limit, offset int) ([]models.Notification, int64, error) {
	return s.repo.GetByUserID(ctx, userID, limit, offset)
}

func (s *NotificationService) MarkAsRead(ctx context.Context, notifID, userID string) error {
	if notifID == "" || userID == "" {
		return errors.New("notifID and userID are required")
	}
	return s.repo.MarkAsRead(ctx, notifID, userID)
}

func (s *NotificationService) Delete(ctx context.Context, notifID, userID string) error {
	if notifID == "" || userID == "" {
		return errors.New("notifID and userID are required")
	}
	return s.repo.Delete(ctx, notifID, userID)
}

func (s *NotificationService) GetUnreadCount(ctx context.Context, userID string) (int64, error) {
	return s.repo.CountUnread(ctx, userID)
}
