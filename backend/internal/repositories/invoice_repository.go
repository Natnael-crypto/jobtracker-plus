package repositories

import (
	"backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type InvoiceRepository struct {
	db *gorm.DB
}

func NewInvoiceRepository(db *gorm.DB) *InvoiceRepository {
	return &InvoiceRepository{db: db}
}

func (r *InvoiceRepository) Create(ctx context.Context, invoice *models.Invoice, lineItems []models.LineItem) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(invoice).Error; err != nil {
			return err
		}
		for i := range lineItems {
			lineItems[i].ParentID = invoice.ID
			lineItems[i].Type = "Invoice"
		}
		if len(lineItems) > 0 {
			if err := tx.Create(&lineItems).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *InvoiceRepository) GetAllUserInvoices(ctx context.Context, userID string, limit, offset int) ([]models.Invoice, int64, error) {
	var invoices []models.Invoice
	var total int64

	// Count total for pagination metadata
	if err := r.db.WithContext(ctx).Model(&models.Invoice{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Fetch paginated invoices
	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&invoices).Error; err != nil {
		return nil, 0, err
	}

	return invoices, total, nil
}

func (r *InvoiceRepository) GetByID(ctx context.Context, id string) (*models.Invoice, []models.LineItem, error) {
	var invoices models.Invoice
	if err := r.db.WithContext(ctx).Where("id = ?", id).Order("created_at DESC").First(&invoices).Error; err != nil {
		return nil, nil, err
	}

	var items []models.LineItem
	if err := r.db.WithContext(ctx).Where("parent_id = ? AND type = ?", invoices.ID, "Invoice").Find(&items).Error; err != nil {
		return &invoices, []models.LineItem{}, err
	}

	return &invoices, items, nil
}

func (r *InvoiceRepository) DeleteByJobID(ctx context.Context, id, userID string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Invoice{}).Error; err != nil {
			return err
		}
		if err := tx.Where("parent_id = ? AND type = ?", id, "Invoice").Delete(&models.LineItem{}).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *InvoiceRepository) GetByUserIDJobID(ctx context.Context, jobID, userID string) ([]models.Invoice, error) {
	var userProfile models.UserProfile
	if err := r.db.WithContext(ctx).First(&userProfile, "id = ?", userID).Error; err != nil {
		return nil, err
	}

	var invoice []models.Invoice
	err := r.db.WithContext(ctx).Where("user_id = ? AND job_id = ?", userProfile.UserID, jobID).Order("created_at DESC").Find(&invoice).Error
	return invoice, err
}

func (r *InvoiceRepository) GetByUserIDJobIDBusiness(ctx context.Context, jobID, userID string) ([]models.Invoice, error) {

	var invoice []models.Invoice
	err := r.db.WithContext(ctx).Where("user_id = ? AND job_id = ?", userID, jobID).Order("created_at DESC").Find(&invoice).Error
	return invoice, err
}

func (r *InvoiceRepository) Update(ctx context.Context, invoice *models.Invoice) error {
	return r.db.WithContext(ctx).Save(invoice).Error
}
