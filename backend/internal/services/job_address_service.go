package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type JobAddressService struct {
	repo    repositories.JobAddressRepository
	APIKey  string
	JobRepo repositories.JobRepository
}

func NewJobAddressService(repo repositories.JobAddressRepository, apiKey string, JobRepo repositories.JobRepository) *JobAddressService {
	return &JobAddressService{repo: repo, APIKey: apiKey, JobRepo: JobRepo}
}

// Create new job address
func (s *JobAddressService) Create(userID, jobID, street, city, state, zip, country string) (*models.JobAddress, error) {
	if jobID == "" {
		return nil, errors.New("job_id is required")
	}

	if street == "" || city == "" || state == "" || zip == "" || country == "" {
		return nil, errors.New("address fields are required")
	}

	lat, lng, err := utils.GeocodeAddress(street, city, state, zip, country, s.APIKey)
	if err != nil {
		return nil, fmt.Errorf("failed to geocode address: %w", err)
	}

	address := &models.JobAddress{
		ID:        uuid.NewString(),
		JobID:     jobID,
		Street:    street,
		City:      city,
		State:     state,
		Zip:       zip,
		Country:   country,
		Latitude:  lat,
		Longitude: lng,
		CreatedAt: time.Now(),
	}

	if err := s.repo.Create(address); err != nil {
		return nil, fmt.Errorf("failed to create job address: %w", err)
	}

	return address, nil
}

func (s *JobAddressService) GetByJobID(jobID string) (*models.JobAddress, error) {
	if jobID == "" {
		return nil, errors.New("job_id is required")
	}
	return s.repo.GetByJobID(jobID)
}
