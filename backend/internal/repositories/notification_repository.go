package repositories

import (
	"backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type NotificationRepository interface {
	Create(ctx context.Context, notif *models.Notification) error
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]models.Notification, int64, error)
	MarkAsRead(ctx context.Context, notifID, userID string) error
	Delete(ctx context.Context, notifID, userID string) error
	CountUnread(ctx context.Context, userID string) (int64, error)
}

type notificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) NotificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) Create(ctx context.Context, notif *models.Notification) error {
	return r.db.WithContext(ctx).Create(notif).Error
}

func (r *notificationRepository) GetByUserID(ctx context.Context, userID string, limit, offset int) ([]models.Notification, int64, error) {
	var notifs []models.Notification
	var total int64

	// Count total notifications for pagination metadata
	if err := r.db.WithContext(ctx).
		Model(&models.Notification{}).
		Where("user_id = ?", userID).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Fetch paginated records
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifs).Error

	return notifs, total, err
}

func (r *notificationRepository) MarkAsRead(ctx context.Context, notifID, userID string) error {
	return r.db.WithContext(ctx).
		Model(&models.Notification{}).
		Where("id = ? AND user_id = ?", notifID, userID).
		Update("read_at", gorm.Expr("CURRENT_TIMESTAMP")).Error
}

func (r *notificationRepository) Delete(ctx context.Context, notifID, userID string) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", notifID, userID).
		Delete(&models.Notification{}).Error
}

func (r *notificationRepository) CountUnread(ctx context.Context, userID string) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&models.Notification{}).
		Where("user_id = ? AND read_at IS NULL", userID).
		Count(&count).Error
	return count, err
}
