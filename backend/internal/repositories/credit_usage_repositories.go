package repositories

import (
	"backend/internal/models"
	"errors"

	"gorm.io/gorm"
)

type CreditUsageRepository struct {
	db *gorm.DB
}

func NewCreditUsageRepository(db *gorm.DB) *CreditUsageRepository {
	return &CreditUsageRepository{db: db}
}

func (r *CreditUsageRepository) Create(credit *models.CreditUsage) error {
	if err := r.db.Create(credit).Error; err != nil {
		return err
	}
	return nil
}

func (r *CreditUsageRepository) GetByUserID(
	userID, search, reason string,
	refunded *bool,
	limit, offset int,
) ([]models.CreditUsage, int64, error) {

	var credits []models.CreditUsage
	var total int64

	query := r.db.Model(&models.CreditUsage{}).Where("user_id = ?", userID)

	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Where("id LIKE ? OR job_id LIKE ?", searchPattern, searchPattern)
	}

	if reason != "" {
		query = query.Where("reason = ?", reason)
	}

	if refunded != nil {
		query = query.Where("refunded = ?", *refunded)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&credits).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []models.CreditUsage{}, 0, nil
		}
		return nil, 0, err
	}

	return credits, total, nil
}

// Admin view: all users with pagination and filters
func (r *CreditUsageRepository) GetByAdmin(
	search, userID, reason string,
	refunded *bool,
	limit, offset int,
) ([]models.CreditUsage, int64, error) {

	var credits []models.CreditUsage
	var total int64

	query := r.db.Model(&models.CreditUsage{})

	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Where("id LIKE ? OR job_id LIKE ?", searchPattern, searchPattern)
	}

	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}

	if reason != "" {
		query = query.Where("reason = ?", reason)
	}

	if refunded != nil {
		query = query.Where("refunded = ?", *refunded)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&credits).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []models.CreditUsage{}, 0, nil
		}
		return nil, 0, err
	}

	return credits, total, nil
}
