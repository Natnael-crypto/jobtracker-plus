package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type ServiceRepository interface {
	Create(service *models.Service) error
	Delete(serviceID string, userID string) error
	GetByUserID(userID string) ([]models.Service, error)
}

type serviceRepository struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) ServiceRepository {
	return &serviceRepository{db: db}
}

func (r *serviceRepository) Create(service *models.Service) error {
	return r.db.Create(service).Error
}

func (r *serviceRepository) Delete(serviceID string, userID string) error {
	// Soft delete ensures data is recoverable
	return r.db.Unscoped().Where("id = ? AND user_id = ?", serviceID, userID).Delete(&models.Service{}).Error
}

func (r *serviceRepository) GetByUserID(userID string) ([]models.Service, error) {
	var services []models.Service
	err := r.db.Where("user_id = ?", userID).Find(&services).Error
	if err != nil {
		return nil, err
	}
	return services, nil
}
