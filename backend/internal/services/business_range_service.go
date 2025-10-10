package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"fmt"

	"github.com/google/uuid"
)

type BusinessRangeService struct {
	repo     repositories.BusinessRangeRepository
	userRepo repositories.UserRepository
}

func NewBusinessRangeService(repo repositories.BusinessRangeRepository, userRepo repositories.UserRepository) *BusinessRangeService {
	return &BusinessRangeService{repo: repo, userRepo: userRepo}
}

func (s *BusinessRangeService) CreateBusinessRange(userID string, rangeKm int) (*models.BusinessRange, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can set range")
	}

	existing, _ := s.repo.GetByUserID(userID)
	if existing != nil {
		return nil, errors.New("business range already exists, use update instead")
	}

	br := &models.BusinessRange{
		ID:      uuid.NewString(),
		UserID:  userID,
		RangeKm: rangeKm,
	}

	if err := s.repo.Create(br); err != nil {
		return nil, err
	}
	return br, nil
}

func (s *BusinessRangeService) UpdateBusinessRange(userID string, rangeKm int) (*models.BusinessRange, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can update range")
	}

	br, err := s.repo.GetByUserID(userID)
	if err != nil {
		br := &models.BusinessRange{
			ID:      uuid.NewString(),
			UserID:  userID,
			RangeKm: rangeKm,
		}

		if err := s.repo.Create(br); err != nil {
			return nil, err
		}
		return br, nil
	}

	br.RangeKm = rangeKm
	if err := s.repo.Update(br); err != nil {
		return nil, err
	}
	return br, nil
}

func (s *BusinessRangeService) GetBusinessRange(userID string) (*models.BusinessRange, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users have range")
	}

	br, err := s.repo.GetByUserID(userID)
	if err != nil {
		br := &models.BusinessRange{
			ID:      uuid.NewString(),
			UserID:  userID,
			RangeKm: 30,
		}

		if err := s.repo.Create(br); err != nil {
			return nil, err
		}
		return br, nil
	}
	return br, nil
}
