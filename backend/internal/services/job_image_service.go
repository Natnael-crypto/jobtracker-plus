package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"
	"bytes"
	"context"
	"errors"
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
func (s *JobImageService) CreateJobImage(ctx context.Context, jobID string, file multipart.File, header *multipart.FileHeader) (*models.JobImage, error) {

	images, err := s.repo.GetByJobID(jobID)
	if err != nil {
		return nil, err
	}

	if len(images) > 10 {
		return nil, errors.New("you can only upload 10 images")
	}

	ext := strings.TrimPrefix(filepath.Ext(header.Filename), ".")
	contentType := header.Header.Get("Content-Type")

	// read file into buffer
	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// generate S3 key

	image_id := uuid.NewString()
	key := fmt.Sprintf("job/%s.%s", image_id, ext)

	// upload to S3
	imageURL, err := s.s3Service.UploadProfileImage(ctx, buf, contentType, ext, key)
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

func (s *JobImageService) DeleteJobImage(ctx context.Context, imageID, userID string) error {
	image, err := s.repo.GetByID(imageID)
	if err != nil {
		return fmt.Errorf("image not found: %w", err)
	}
	job, err := s.repo.GetJobByID(image.JobID)
	if err != nil {
		return fmt.Errorf("job not found: %w", err)
	}
	if job.UserID != userID {
		return errors.New("you can only delete images for your own jobs")
	}

	return s.repo.Delete(image.ID)
}
