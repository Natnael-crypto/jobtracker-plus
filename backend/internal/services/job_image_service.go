package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"
	"bytes"
	"context"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

type JobImageService struct {
	repo      repositories.JobImageRepository
	s3Service utils.S3Service
}

func NewJobImageService(repo repositories.JobImageRepository, s3 utils.S3Service) *JobImageService {
	return &JobImageService{repo: repo, s3Service: s3}
}

// Upload & save job image
func (s *JobImageService) CreateJobImage(ctx context.Context, userID, jobID string, file multipart.File, header *multipart.FileHeader) (*models.JobImage, error) {
	ext := strings.TrimPrefix(filepath.Ext(header.Filename), ".")
	contentType := header.Header.Get("Content-Type")

	// read file into buffer
	buf := new(bytes.Buffer)
	_, err := buf.ReadFrom(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// generate S3 key

	image_id := uuid.NewString()
	key := fmt.Sprintf("job/%s/%s.%s", userID, image_id, ext)

	// upload to S3
	imageURL, err := s.s3Service.UploadProfileImage(ctx, buf, contentType, ext, userID, key)
	if err != nil {
		return nil, fmt.Errorf("failed to upload image: %w", err)
	}

	// save metadata in DB
	jobImage := &models.JobImage{
		ID:        image_id,
		JobID:     jobID,
		ImageURL:  imageURL,
		CreatedAt: time.Now(),
	}

	if err := s.repo.Create(jobImage); err != nil {
		return nil, fmt.Errorf("failed to save job image: %w", err)
	}

	return jobImage, nil
}

func (s *JobImageService) GetJobImages(jobID string) ([]models.JobImage, error) {
	return s.repo.GetByJobID(jobID)
}

func (s *JobImageService) DeleteJobImage(ctx context.Context, imageID string) error {
	image, err := s.repo.GetByID(imageID)
	if err != nil {
		return fmt.Errorf("image not found: %w", err)
	}

	return s.repo.Delete(image.ID)
}
