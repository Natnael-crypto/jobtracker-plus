package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type UserAddressRepository struct {
	DB *gorm.DB
}

func NewUserAddressRepository(db *gorm.DB) *UserAddressRepository {
	return &UserAddressRepository{DB: db}
}

func (r *UserAddressRepository) GetByUserID(userID string) (*models.UserAddress, error) {
	var address models.UserAddress
	err := r.DB.Where("user_id = ?", userID).First(&address).Error
	if err != nil {
		return nil, err
	}
	return &address, err
}

func (r *UserAddressRepository) Create(address *models.UserAddress) error {
	return r.DB.Create(address).Error
}

func (r *UserAddressRepository) Update(address *models.UserAddress) error {
	return r.DB.Save(address).Error
}
