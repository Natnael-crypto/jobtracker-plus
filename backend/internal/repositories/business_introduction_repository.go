package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type BusinessIntroductionRepository interface {
	Create(intro *models.BusinessIntroduction) error
	Update(intro *models.BusinessIntroduction) error
	GetByUserID(userID string) (*models.BusinessIntroduction, error)
}

type businessIntroductionRepository struct {
	db *gorm.DB
}

func NewBusinessIntroductionRepository(db *gorm.DB) BusinessIntroductionRepository {
	return &businessIntroductionRepository{db: db}
}

func (r *businessIntroductionRepository) Create(intro *models.BusinessIntroduction) error {
	return r.db.Create(intro).Error
}

func (r *businessIntroductionRepository) Update(intro *models.BusinessIntroduction) error {
	return r.db.Save(intro).Error
}

func (r *businessIntroductionRepository) GetByUserID(userID string) (*models.BusinessIntroduction, error) {
	var intro models.BusinessIntroduction
	err := r.db.Where("user_id = ?", userID).First(&intro).Error
	if err != nil {
		return nil, err
	}
	return &intro, nil
}
