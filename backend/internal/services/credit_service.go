package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type CreditService struct {
	repo     repositories.CreditRepository
	userRepo repositories.UserRepository
}

func NewCreditService(repo repositories.CreditRepository, userRepo repositories.UserRepository) *CreditService {
	return &CreditService{repo: repo, userRepo: userRepo}
}

// CreateCredit creates initial credit record for a business user
func (s *CreditService) CreateCredit(userID string) (*models.Credit, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can have credits")
	}

	credit := &models.Credit{
		ID:               uuid.NewString(),
		UserID:           userID,
		TotalCredits:     10,
		AvailableCredits: 10,
		UpdatedAt:        time.Now(),
	}

	if err := s.repo.Create(credit); err != nil {
		return nil, err
	}

	return credit, nil
}

// AddCredits adds credits to a business user
func (s *CreditService) AddCredits(userID string, amount int) error {
	if amount <= 0 {
		return errors.New("amount must be greater than 0")
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return errors.New("only business users can receive credits")
	}

	return s.repo.AddCredits(userID, amount)
}

func (s *CreditService) CreateCreditHistory(userID string, amount int) error {
	credit := &models.CreditHistory{
		ID:           uuid.NewString(),
		UserID:       userID,
		CreditChange: amount,
		CreatedAt:    time.Now(),
	}
	return s.repo.CreateCreditHistory(credit)
}

// GetCredit retrieves credit info for a business user
func (s *CreditService) GetCredit(userID string) (*models.Credit, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users have credits")
	}

	return s.repo.GetByUserID(userID)
}

func (s *CreditService) GetAllUserCreditHistory(userID string, limit, offset int) ([]models.CreditHistory, int64, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, 0, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, 0, errors.New("only business users have credits")
	}

	return s.repo.GetAllUserCreditHistory(userID, limit, offset)
}
