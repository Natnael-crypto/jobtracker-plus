package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type UserTokenRepository struct {
	db *gorm.DB
}

func NewUserTokenRepository(db *gorm.DB) *UserTokenRepository {
	return &UserTokenRepository{db: db}
}

func (r *UserTokenRepository) Create(token *models.UserToken) error {
	return r.db.Create(token).Error
}

func (r *UserTokenRepository) GetByUserAndType(code, tokenType string) (*models.UserToken, error) {
	var token models.UserToken
	err := r.db.Where("token = ? AND type = ?", code, tokenType).First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *UserTokenRepository) DeleteByIDUnscoped(id string, types string) error {
	return r.db.Unscoped().Where("id = ? AND type = ?", id, types).Delete(&models.UserToken{}).Error
}

func (r *UserTokenRepository) Update(token *models.UserToken) error {
	return r.db.Save(token).Error
}

func (r *UserTokenRepository) FindVerificationByUserID(userID, types string) (*models.UserVerification, error) {
	var verification models.UserVerification
	err := r.db.Where("user_id = ? AND type = ?", userID, types).First(&verification).Error
	if err != nil {
		return nil, err
	}
	return &verification, nil
}
