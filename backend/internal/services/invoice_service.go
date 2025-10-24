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

type InvoiceService struct {
	repo         repositories.InvoiceRepository
	notification *NotificationService
}

func NewInvoiceService(repo repositories.InvoiceRepository, notification *NotificationService) *InvoiceService {
	return &InvoiceService{repo: repo, notification: notification}
}

func (s *InvoiceService) Create(ctx context.Context,
	userID string,
	jobID string,
	discount float64,
	tax float64,
	terms string,
	dueDate time.Time,
	street string,
	city string,
	state string,
	country string,
	phone string,
	email string,
	logoURL string,
	jobTitle string,
	bankAccountName string,
	bankAccountNumber string,
	bankName string,
	sortCode string,
	bankRoutingNumber string,
	lineItems []models.LineItemRequest) (*models.Invoice, []models.LineItem, error) {
	if jobID == "" || dueDate.IsZero() {
		return nil, nil, errors.New("jobID and dueDate are required")
	}

	invoice := &models.Invoice{
		ID:                 utils.GenerateFriendlyID("INV", 7),
		UserID:             userID,
		JobID:              jobID,
		Discount:           discount,
		Tax:                tax,
		TermsAndConditions: terms,
		Total:              0,
		Status:             "in_progress",
		BankAccountName:    bankAccountName,
		BankAccountNumber:  bankAccountNumber,
		BankName:           bankName,
		SortCode:           sortCode,
		BankRoutingNumber:  bankRoutingNumber,
		Street:             street,
		City:               city,
		State:              state,
		Country:            country,
		Phone:              phone,
		Email:              email,
		LogoUrl:            logoURL,
		JobTitle:           jobTitle,
		DueDate:            dueDate,
		CreatedAt:          time.Now(),
	}

	var lineItemsModel []models.LineItem
	total := 0.0
	for _, item := range lineItems {
		lineItemsModel = append(lineItemsModel, models.LineItem{
			ID:       uuid.NewString(),
			ParentID: invoice.ID,
			Type:     "Invoice",
			Service:  item.Service,
			Unit:     item.Unit,
			Quantity: item.Quantity,
			Rate:     item.Rate,
			Total:    item.Total,
		})
		total += item.Total
	}

	invoice.Total = total + (total * tax / 100) - discount

	if err := s.repo.Create(ctx, invoice, lineItemsModel); err != nil {
		return nil, nil, err
	}

	invoices, lineItemsList, err := s.repo.GetByID(ctx, invoice.ID)
	if err != nil {
		return nil, nil, err
	}

	s.notification.Create(context.Background(), userID, "Invoice Received", "You’ve received a new invoice for "+jobTitle+" job. Review and process the payment securely.")

	return invoices, lineItemsList, nil
}

func (s *InvoiceService) GetByInvoiceID(ctx context.Context, id string) (*models.Invoice, []models.LineItem, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *InvoiceService) GetAllUserInvoices(ctx context.Context, userID string, limit, offset int) ([]models.Invoice, int64, error) {
	return s.repo.GetAllUserInvoices(ctx, userID, limit, offset)
}

func (s *InvoiceService) DeleteByJob(ctx context.Context, id, userID string) error {
	return s.repo.DeleteByJobID(ctx, id, userID)
}

func (s *InvoiceService) UpdateStatus(ctx context.Context, id, status, userID string) error {

	invoices, _, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if invoices.UserID != userID {
		return errors.New("unauthorized")
	}

	if status != "paid" {
		return errors.New("invalid status")
	}
	invoices.Status = status

	return s.repo.Update(ctx, invoices)
}

func (s *InvoiceService) GetByUserIdJobId(ctx context.Context, userID, jobId string) ([]models.Invoice, error) {
	return s.repo.GetByUserIDJobID(ctx, jobId, userID)
}

func (s *InvoiceService) GetByUserIdJobIdBusiness(ctx context.Context, userID, jobId string) ([]models.Invoice, error) {
	return s.repo.GetByUserIDJobIDBusiness(ctx, jobId, userID)
}
