package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type BusinessRangeRepository interface {
	Create(rangeModel *models.BusinessRange) error
	Update(rangeModel *models.BusinessRange) error
	GetByUserID(userID string) (*models.BusinessRange, error)
}

type businessRangeRepository struct {
	db *gorm.DB
}

func NewBusinessRangeRepository(db *gorm.DB) BusinessRangeRepository {
	return &businessRangeRepository{db: db}
}

func (r *businessRangeRepository) Create(rangeModel *models.BusinessRange) error {
	return r.db.Create(rangeModel).Error
}

func (r *businessRangeRepository) Update(rangeModel *models.BusinessRange) error {
	return r.db.Save(rangeModel).Error
}

func (r *businessRangeRepository) GetByUserID(userID string) (*models.BusinessRange, error) {
	var br models.BusinessRange
	err := r.db.Where("user_id = ?", userID).First(&br).Error
	if err != nil {
		return nil, err
	}
	return &br, nil
}
