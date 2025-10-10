package repositories

import (
	"backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type QuotationRepository interface {
	Create(ctx context.Context, quotation *models.Quotation, lineItems []models.LineItem) error
	GetByJobID(ctx context.Context, userID, jobID string) ([]models.Quotation, map[string][]models.LineItem, error)
	GetByID(ctx context.Context, id string) (*models.Quotation, []models.LineItem, error)
	Delete(ctx context.Context, id string, userID string) error
	GetByUser(ctx context.Context, userID, jobID string) ([]models.Quotation, error)
	GetByQuoteID(ctx context.Context, id string) (*models.Quotation, []models.LineItem, error)
	Update(ctx context.Context, quotation *models.Quotation) error
}

type quotationRepository struct {
	db *gorm.DB
}

func NewQuotationRepository(db *gorm.DB) QuotationRepository {
	return &quotationRepository{db: db}
}

func (r *quotationRepository) Create(ctx context.Context, quotation *models.Quotation, lineItems []models.LineItem) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(quotation).Error; err != nil {
			return err
		}
		for i := range lineItems {
			lineItems[i].ParentID = quotation.ID
			lineItems[i].Type = "Quotation"
		}
		if len(lineItems) > 0 {
			if err := tx.Create(&lineItems).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *quotationRepository) GetByID(ctx context.Context, id string) (*models.Quotation, []models.LineItem, error) {
	var quotation models.Quotation
	if err := r.db.WithContext(ctx).First(&quotation, "id = ?", id).Error; err != nil {
		return nil, nil, err
	}

	var items []models.LineItem
	if err := r.db.WithContext(ctx).Where("parent_id = ? AND type = ?", id, "Quotation").Find(&items).Error; err != nil {
		return &quotation, nil, err
	}

	return &quotation, items, nil
}

func (r *quotationRepository) GetByJobID(ctx context.Context, userID, jobID string) ([]models.Quotation, map[string][]models.LineItem, error) {

	var userProfile models.UserProfile
	if err := r.db.WithContext(ctx).First(&userProfile, "id = ?", userID).Error; err != nil {
		return nil, nil, err
	}

	var quotations []models.Quotation
	if err := r.db.WithContext(ctx).
		Where("job_id = ? AND user_id = ?", jobID, userProfile.UserID).
		Find(&quotations).Error; err != nil {
		return nil, nil, err
	}

	if len(quotations) == 0 {
		return []models.Quotation{}, map[string][]models.LineItem{}, nil
	}

	// Collect quotation IDs
	var quotationIDs []string
	for _, q := range quotations {
		quotationIDs = append(quotationIDs, q.ID)
	}

	var items []models.LineItem
	if err := r.db.WithContext(ctx).
		Where("parent_id IN ? AND type = ?", quotationIDs, "Quotation").
		Find(&items).Error; err != nil {
		return quotations, nil, err
	}

	// Group line items by quotation ID
	itemMap := make(map[string][]models.LineItem)
	for _, item := range items {
		itemMap[item.ParentID] = append(itemMap[item.ParentID], item)
	}

	return quotations, itemMap, nil
}

func (r *quotationRepository) GetByQuoteID(ctx context.Context, id string) (*models.Quotation, []models.LineItem, error) {
	var quotation models.Quotation
	if err := r.db.WithContext(ctx).First(&quotation, "id = ?", id).Error; err != nil {
		return nil, nil, err
	}

	var items []models.LineItem
	if err := r.db.WithContext(ctx).Where("parent_id = ? AND type = ?", id, "Quotation").Find(&items).Error; err != nil {
		return &quotation, nil, err
	}

	return &quotation, items, nil
}

func (r *quotationRepository) Delete(ctx context.Context, id string, userID string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Quotation{}).Error; err != nil {
			return err
		}
		if err := tx.Where("parent_id = ? AND type = ?", id, "Quotation").Delete(&models.LineItem{}).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *quotationRepository) GetByUser(ctx context.Context, userID, jobID string) ([]models.Quotation, error) {
	var quotations []models.Quotation
	err := r.db.WithContext(ctx).Where("user_id = ? AND job_id = ?", userID, jobID).Order("created_at DESC").Find(&quotations).Error
	return quotations, err
}

func (r *quotationRepository) Update(ctx context.Context, quotation *models.Quotation) error {
	return r.db.WithContext(ctx).Save(quotation).Error
}
