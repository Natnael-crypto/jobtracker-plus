package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

type QuotationService struct {
	repo         repositories.QuotationRepository
	notification *NotificationService
}

func NewQuotationService(repo repositories.QuotationRepository, notification *NotificationService) *QuotationService {
	return &QuotationService{repo: repo, notification: notification}
}

func (s *QuotationService) Create(ctx context.Context, userID, jobID string, discount, tax float64, terms string, street, city, state, country, phone, email, logoURL, jobTitle string, lineItems []models.LineItemRequest) (*models.Quotation, []models.LineItem, error) {
	if jobID == "" {
		return nil, nil, errors.New("jobID is required")
	}
	job, err := s.repo.GetJobByID(ctx, jobID)
	if err != nil {
		return nil, nil, errors.New("job not found")
	}

	var subtotal float64
	for _, item := range lineItems {
		subtotal += float64(item.Quantity) * item.Rate
	}

	taxAmount := (subtotal - discount) * tax
	total := subtotal - discount + taxAmount

	quotation := &models.Quotation{
		ID:                 utils.GenerateFriendlyID("QUO", 7),
		UserID:             userID,
		JobID:              jobID,
		Discount:           discount,
		Tax:                tax,
		Total:              total,
		TermsAndConditions: terms,
		Street:             street,
		City:               city,
		State:              state,
		Country:            country,
		Phone:              phone,
		Email:              email,
		LogoUrl:            logoURL,
		JobTitle:           jobTitle,
		Status:             "in_progress",
		CreatedAt:          time.Now(),
	}

	var lineItemsModel []models.LineItem
	for _, item := range lineItems {
		lineItemsModel = append(lineItemsModel, models.LineItem{
			ID:          uuid.NewString(),
			ParentID:    quotation.ID,
			Type:        "Quotation",
			Service:     item.Service,
			Unit:        item.Unit,
			Quantity:    item.Quantity,
			Rate:        item.Rate,
			Total:       item.Total,
			Description: item.Description,
		})
	}

	if err := s.repo.Create(ctx, quotation, lineItemsModel); err != nil {
		return nil, nil, err
	}

	s.notification.Create(context.Background(), job.UserID, "Quotation Received", "A business user has sent you a quotation for "+job.Headline+" job. Review the offer and take the next step.")
	return s.repo.GetByID(ctx, quotation.ID)
}

func (s *QuotationService) GetByJobID(ctx context.Context, userID, jobID string) ([]models.Quotation, map[string][]models.LineItem, error) {
	return s.repo.GetByJobID(ctx, userID, jobID)
}

func (s *QuotationService) GetByQuoteID(ctx context.Context, id string) (*models.Quotation, []models.LineItem, error) {
	return s.repo.GetByQuoteID(ctx, id)
}

func (s *QuotationService) Delete(ctx context.Context, id, userID string) error {
	return s.repo.Delete(ctx, id, userID)
}

func (s *QuotationService) GetByUser(ctx context.Context, userID, jobId string) ([]models.Quotation, error) {
	return s.repo.GetByUser(ctx, userID, jobId)
}

func (s *QuotationService) UpdateStatus(ctx context.Context, id, status string) error {

	quote, _, err := s.repo.GetByQuoteID(ctx, id)
	if err != nil {
		return err
	}
	if status != "accepted" && status != "rejected" {
		return errors.New("invalid status")
	}
	quote.Status = status

	return s.repo.Update(ctx, quote)
}
