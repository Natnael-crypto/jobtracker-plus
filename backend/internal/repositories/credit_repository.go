package repositories

import (
	"backend/internal/models"
	"time"

	"gorm.io/gorm"
)

type CreditRepository interface {
	Create(credit *models.Credit) error
	AddCredits(userID string, amount int) error
	GetByUserID(userID string) (*models.Credit, error)
	DeductCredits(userID string, amount int) error
	GetAllUserCreditHistory(userID string, limit, offset int) ([]models.CreditHistory, int64, error)
	CreateCreditHistory(credit *models.CreditHistory) error
}

type creditRepository struct {
	db *gorm.DB
}

func NewCreditRepository(db *gorm.DB) CreditRepository {
	return &creditRepository{db: db}
}

func (r *creditRepository) Create(credit *models.Credit) error {
	return r.db.Create(credit).Error
}

func (r *creditRepository) AddCredits(userID string, amount int) error {
	return r.db.Model(&models.Credit{}).
		Where("user_id = ?", userID).
		Updates(map[string]interface{}{
			"total_credits":     gorm.Expr("total_credits + ?", amount),
			"available_credits": gorm.Expr("available_credits + ?", amount),
			"updated_at":        time.Now(),
		}).Error
}

func (r *creditRepository) GetByUserID(userID string) (*models.Credit, error) {
	var credit models.Credit
	err := r.db.Where("user_id = ?", userID).First(&credit).Error
	if err != nil {
		return nil, err
	}
	return &credit, nil
}

func (r *creditRepository) CreateCreditHistory(credit *models.CreditHistory) error {
	return r.db.Create(credit).Error
}

func (r *creditRepository) GetAllUserCreditHistory(userID string, limit, offset int) ([]models.CreditHistory, int64, error) {
	var credit []models.CreditHistory

	var total int64

	if err := r.db.Model(&models.CreditHistory{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Limit(limit).Offset(offset).Find(&credit).Error
	if err != nil {
		return nil, total, err
	}
	return credit, total, nil
}

func (r *creditRepository) DeductCredits(userID string, amount int) error {
	return r.db.Model(&models.Credit{}).
		Where("user_id = ?", userID).
		Updates(map[string]interface{}{
			"available_credits": gorm.Expr("available_credits - ?", amount),
			"updated_at":        time.Now(),
		}).Error
}
