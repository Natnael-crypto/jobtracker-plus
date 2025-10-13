package repositories

import (
	"backend/internal/models"
	"errors"

	"gorm.io/gorm"
)

type UserVerificationRepository struct {
	DB *gorm.DB
}

func NewUserVerificationRepository(db *gorm.DB) *UserVerificationRepository {
	return &UserVerificationRepository{DB: db}
}

func (r *UserVerificationRepository) Create(v *models.UserVerification) error {
	return r.DB.Create(v).Error
}

func (r *UserVerificationRepository) GetByUserID(userID string, vType string) (*models.UserVerification, error) {
	var v models.UserVerification
	err := r.DB.Where("user_id = ? AND type = ?", userID, vType).First(&v).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &v, err
}

func (r *UserVerificationRepository) UpdateVerified(id string, verified bool) error {
	return r.DB.Model(&models.UserVerification{}).Where("id = ?", id).Update("verified", verified).Error
}

func (r *UserVerificationRepository) GetBySessionID(sessionID string) (*models.UserVerification, error) {
	var v *models.UserVerification
	err := r.DB.Where("session_id = ?", sessionID).First(&v).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return v, nil
	}
	return v, err
}
