package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type JobImageRepository interface {
	Create(image *models.JobImage) error
	GetByJobID(jobID string) ([]models.JobImage, error)
	GetByID(id string) (*models.JobImage, error)
	Delete(id string) error
	GetJobByID(jobID string) (*models.Job, error)
}

type jobImageRepository struct {
	db *gorm.DB
}

func NewJobImageRepository(db *gorm.DB) JobImageRepository {
	return &jobImageRepository{db: db}
}

func (r *jobImageRepository) Create(image *models.JobImage) error {
	return r.db.Create(image).Error
}

func (r *jobImageRepository) GetByJobID(jobID string) ([]models.JobImage, error) {
	var images []models.JobImage
	err := r.db.Where("job_id = ?", jobID).Find(&images).Error
	return images, err
}

func (r *jobImageRepository) GetByID(id string) (*models.JobImage, error) {
	var image models.JobImage
	err := r.db.First(&image, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &image, nil
}

func (r *jobImageRepository) Delete(id string) error {
	return r.db.Unscoped().Delete(&models.JobImage{}, "id = ?", id).Error
}

func (r *jobImageRepository) GetJobByID(jobID string) (*models.Job, error) {
	var job models.Job
	err := r.db.First(&job, "id = ?", jobID).Error
	if err != nil {
		return nil, err
	}
	return &job, nil

}
