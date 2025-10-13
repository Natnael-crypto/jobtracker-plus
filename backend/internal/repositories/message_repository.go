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
	GetJobByID(jobID string) (models.Job, error)
	GetJobBidInvite(jobID, userID string) (*models.JobBid, *models.JobInvitation)
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

func (r *messageRepository) GetJobByID(jobID string) (models.Job, error) {
	var job models.Job
	err := r.db.Where("id = ?", jobID).First(&job).Error
	return job, err

}

func (r *messageRepository) GetJobBidInvite(jobID, userID string) (*models.JobBid, *models.JobInvitation) {
	var jobBid models.JobBid
	var jobInvite models.JobInvitation

	var bidFound, inviteFound bool

	// Business applied and was shortlisted, hired, or completed
	if err := r.db.Where(
		"job_id = ? AND user_id = ? AND status IN ('shortlisted', 'hired', 'completed')",
		jobID, userID,
	).First(&jobBid).Error; err == nil {
		bidFound = true
	}

	// Business was invited and accepted/hired/completed
	if err := r.db.Where(
		"job_id = ? AND business_id = ? AND status IN ('accepted', 'hired', 'completed')",
		jobID, userID,
	).First(&jobInvite).Error; err == nil {
		inviteFound = true
	}

	if !bidFound && !inviteFound {
		return nil, nil
	}

	// Return only non-nil references
	var bidPtr *models.JobBid
	var invitePtr *models.JobInvitation
	if bidFound {
		bidPtr = &jobBid
	}
	if inviteFound {
		invitePtr = &jobInvite
	}

	return bidPtr, invitePtr
}
