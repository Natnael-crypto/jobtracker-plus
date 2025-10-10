package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type JobAddressRepository interface {
	Create(address *models.JobAddress) error
	GetByJobID(jobID string) (*models.JobAddress, error)
}

type jobAddressRepository struct {
	db *gorm.DB
}

func NewJobAddressRepository(db *gorm.DB) JobAddressRepository {
	return &jobAddressRepository{db: db}
}

func (r *jobAddressRepository) Create(address *models.JobAddress) error {
	return r.db.Create(address).Error
}

func (r *jobAddressRepository) GetByJobID(jobID string) (*models.JobAddress, error) {
	var address models.JobAddress
	if err := r.db.Where("job_id = ?", jobID).First(&address).Error; err != nil {
		return nil, err
	}
	return &address, nil
}
