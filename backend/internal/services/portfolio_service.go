package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"
	"bytes"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type PortfolioService struct {
	repo       repositories.PortfolioRepository
	userRepo   repositories.UserRepository
	s3Service  utils.S3Service
	maxUploads int
}

func NewPortfolioService(repo repositories.PortfolioRepository, userRepo repositories.UserRepository, s3Service utils.S3Service) *PortfolioService {
	return &PortfolioService{
		repo:       repo,
		userRepo:   userRepo,
		s3Service:  s3Service,
		maxUploads: 10,
	}
}

func (s *PortfolioService) UploadPortfolioImage(ctx context.Context, userID string, buf *bytes.Buffer, contentType, ext string) (*models.Portfolio, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can upload portfolio images")
	}

	count, err := s.repo.CountByUserID(userID)
	if err != nil {
		return nil, err
	}
	if count >= int64(s.maxUploads) {
		return nil, fmt.Errorf("maximum portfolio images (%d) reached", s.maxUploads)
	}

	key := fmt.Sprintf("portfolio/%s/%s.%s", userID, uuid.NewString(), ext)
	imageURL, err := s.s3Service.UploadProfileImage(ctx, buf, contentType, ext, key)
	if err != nil {
		return nil, err
	}

	portfolio := &models.Portfolio{
		ID:        uuid.NewString(),
		UserID:    userID,
		ImageURL:  imageURL,
		CreatedAt: time.Now(),
	}

	if err := s.repo.Create(portfolio); err != nil {
		return nil, err
	}

	return portfolio, nil
}

func (s *PortfolioService) DeletePortfolioImage(userID, portfolioID string) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return errors.New("only business users can delete portfolio images")
	}

	return s.repo.Delete(portfolioID, userID)
}

func (s *PortfolioService) GetUserPortfolio(userID string) ([]models.Portfolio, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users have portfolios")
	}

	portfolioItems, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	return portfolioItems, nil
}
