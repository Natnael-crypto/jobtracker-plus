package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type BusinessIntroductionService struct {
	repo     repositories.BusinessIntroductionRepository
	userRepo repositories.UserRepository
}

func NewBusinessIntroductionService(repo repositories.BusinessIntroductionRepository, userRepo repositories.UserRepository) *BusinessIntroductionService {
	return &BusinessIntroductionService{repo: repo, userRepo: userRepo}
}

func (s *BusinessIntroductionService) CreateIntroduction(userID, description string) (*models.BusinessIntroduction, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can create introduction")
	}

	intro := &models.BusinessIntroduction{
		ID:          uuid.NewString(),
		UserID:      userID,
		Description: description,
		CreatedAt:   time.Now(),
	}

	if err := s.repo.Create(intro); err != nil {
		return nil, err
	}
	return intro, nil
}

func (s *BusinessIntroductionService) UpdateIntroduction(userID, description string) (*models.BusinessIntroduction, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can update introduction")
	}

	intro, err := s.repo.GetByUserID(userID)
	if err != nil {
		intro := &models.BusinessIntroduction{
			ID:          uuid.NewString(),
			UserID:      userID,
			Description: description,
			CreatedAt:   time.Now(),
		}

		if err := s.repo.Create(intro); err != nil {
			return nil, err
		}
		return intro, nil
	}

	if description != "" {
		intro.Description = description
	}

	if err := s.repo.Update(intro); err != nil {
		return nil, err
	}
	return intro, nil
}

func (s *BusinessIntroductionService) GetIntroduction(userID string) (*models.BusinessIntroduction, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users have introduction")
	}

	return s.repo.GetByUserID(userID)
}
