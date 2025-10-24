package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"time"

	"github.com/google/uuid"
)

type CreditRefundService struct {
	repo           *repositories.CreditRefundRepository
	creditServices *CreditService
}

func NewCreditRefundService(repo *repositories.CreditRefundRepository, creditServices *CreditService) *CreditRefundService {
	return &CreditRefundService{repo: repo, creditServices: creditServices}
}

func (s *CreditRefundService) CreateRefundRequest(userID, creditUsageID, userReason string) (*models.CreditRefundRequest, error) {
	if userID == "" || creditUsageID == "" || userReason == "" {
		return nil, errors.New("missing required fields")
	}

	creditUsage, err := s.repo.GetCreditUsageByID(creditUsageID)
	if err != nil {
		return nil, err
	}

	refund := &models.CreditRefundRequest{
		ID:            uuid.NewString(),
		UserID:        userID,
		CreditUsageID: creditUsageID,
		JobTitle:      creditUsage.JobTitle,
		UserReason:    userReason,
		Status:        "pending",
		CreatedAt:     time.Now(),
	}

	if err := s.repo.Create(refund); err != nil {
		return nil, err
	}
	return refund, nil
}

func (s *CreditRefundService) UpdateRefundStatus(id, status, adminReason string) error {
	if id == "" || status == "" {
		return errors.New("missing required parameters")
	}

	refund, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	if status != "approved" && status != "rejected" {
		return errors.New("invalid status")
	}

	if status == "approved" {
		err := s.creditServices.AddCredits(refund.UserID, 3)
		if err != nil {
			return err
		}
		err = s.repo.UpdateCreditUsage(refund.CreditUsageID)
		if err != nil {
			return err
		}
		err = s.repo.WithdrawUsage(refund.CreditUsageID)
		if err != nil {
			return err
		}
	}

	return s.repo.UpdateStatus(id, status, adminReason)
}

func (s *CreditRefundService) GetRefundRequestsByUser(userID string, page, limit int) ([]models.CreditRefundRequest, int64, error) {
	if userID == "" {
		return nil, 0, errors.New("user id required")
	}
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	return s.repo.GetByUserID(userID, limit, offset)
}

func (s *CreditRefundService) GetRefundRequestsByAdmin(search, userID, status string, page, limit int) ([]models.CreditRefundRequest, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	return s.repo.GetByAdmin(search, userID, status, limit, offset)
}

func (s *CreditRefundService) GetJobDetail(id string) (*repositories.JobDetailResponse, error) {
	return s.repo.GetJobDetail(id)
}
