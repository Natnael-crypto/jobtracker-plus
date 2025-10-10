package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type QualificationRepository interface {
	Create(qualification *models.Qualification) error
	Update(qualification *models.Qualification) error
	Delete(id string, userID string) error
	GetByUserID(userID string) ([]models.Qualification, error)
	GetByID(userID string) (models.Qualification, error)
}

type qualificationRepository struct {
	db *gorm.DB
}

func NewQualificationRepository(db *gorm.DB) QualificationRepository {
	return &qualificationRepository{db: db}
}

func (r *qualificationRepository) Create(qualification *models.Qualification) error {
	return r.db.Create(qualification).Error
}

func (r *qualificationRepository) Update(qualification *models.Qualification) error {
	return r.db.Save(qualification).Error
}

func (r *qualificationRepository) Delete(id string, userID string) error {
	return r.db.Unscoped().Where("id = ? AND user_id = ?", id, userID).Delete(&models.Qualification{}).Error
}

func (r *qualificationRepository) GetByUserID(userID string) ([]models.Qualification, error) {
	var qualifications []models.Qualification
	err := r.db.Where("user_id = ?", userID).Find(&qualifications).Error
	return qualifications, err
}

func (r *qualificationRepository) GetByID(userID string) (models.Qualification, error) {
	var qualifications models.Qualification
	err := r.db.Where("id = ?", userID).First(&qualifications).Error
	return qualifications, err
}
