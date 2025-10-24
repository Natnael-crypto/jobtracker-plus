package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"time"

	"github.com/google/uuid"
)

type CreditUsageService struct {
	repo *repositories.CreditUsageRepository
}

func NewCreditUsageService(repo *repositories.CreditUsageRepository) *CreditUsageService {
	return &CreditUsageService{repo: repo}
}

func (s *CreditUsageService) CreateCreditUsage(userID, jobID, jobTitle, reason string, credit int) (*models.CreditUsage, error) {
	if credit <= 0 {
		return nil, errors.New("credit value must be positive")
	}
	if userID == "" || jobID == "" || reason == "" {
		return nil, errors.New("missing required fields")
	}

	creditUsage := &models.CreditUsage{
		ID:        uuid.NewString(),
		UserID:    userID,
		JobID:     jobID,
		Reason:    reason,
		Credit:    credit,
		Refunded:  false,
		CreatedAt: time.Now(),
	}

	if err := s.repo.Create(creditUsage); err != nil {
		return nil, err
	}
	return creditUsage, nil
}

func (s *CreditUsageService) GetCreditUsagesByUser(
	userID, search, reason string,
	refunded *bool,
	page, limit int,
) ([]models.CreditUsage, int64, error) {

	if userID == "" {
		return nil, 0, errors.New("user id is required")
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	return s.repo.GetByUserID(userID, search, reason, refunded, limit, offset)
}

func (s *CreditUsageService) GetCreditUsagesAdmin(
	search, userID, reason string,
	refunded *bool,
	page, limit int,
) ([]models.CreditUsage, int64, error) {

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	return s.repo.GetByAdmin(search, userID, reason, refunded, limit, offset)
}
