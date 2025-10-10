package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type MessageRepository interface {
	Create(msg *models.Message) error
	Update(msg *models.Message) error
	Delete(id string) error
	GetByID(id string) (*models.Message, error)
	GetConversation(jobID string) ([]models.Message, error)
}

type messageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) MessageRepository {
	return &messageRepository{db: db}
}

func (r *messageRepository) Create(msg *models.Message) error {
	return r.db.Create(msg).Error
}

func (r *messageRepository) Update(msg *models.Message) error {
	return r.db.Save(msg).Error
}

func (r *messageRepository) Delete(id string) error {
	return r.db.Unscoped().Delete(&models.Message{}, "id = ?", id).Error
}

func (r *messageRepository) GetByID(id string) (*models.Message, error) {
	var msg models.Message
	if err := r.db.First(&msg, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &msg, nil
}

func (r *messageRepository) GetConversation(jobID string) ([]models.Message, error) {
	var messages []models.Message
	if err := r.db.Where("job_id = ?", jobID).Order("created_at ASC").Find(&messages).Error; err != nil {
		return nil, err
	}
	return messages, nil
}
