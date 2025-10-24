package repositories

import (
	"backend/internal/models"
	"errors"

	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.DB.Create(user).Error
}

func (r *UserRepository) CreateVerify(user *models.UserVerification) error {
	return r.DB.Create(user).Error
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.DB.Where("email = ?", email).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &user, err
}

func (r *UserRepository) FindByID(id string) (*models.User, error) {
	var user models.User
	err := r.DB.First(&user, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &user, err
}

func (r *UserRepository) FindUserProfileByID(id string) (*models.UserProfile, error) {
	var userProfile models.UserProfile
	err := r.DB.First(&userProfile, "user_id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &userProfile, err
}

func (r *UserRepository) Delete(user *models.User) error {
	return r.DB.Unscoped().Delete(user).Error
}

func (r *UserRepository) Update(user *models.User) error {
	return r.DB.Save(user).Error
}

func (r *UserRepository) UpdateVerify(user *models.UserVerification) error {
	return r.DB.Save(user).Error
}

func (r *UserRepository) Verified(userID, types string) (models.UserVerification, error) {
	var user models.UserVerification
	err := r.DB.Where("user_id = ? AND type = ?", userID, types).First(&user).Error

	return user, err
}
