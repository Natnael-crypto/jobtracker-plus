package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type PortfolioRepository interface {
	Create(portfolio *models.Portfolio) error
	Delete(portfolioID, userID string) error
	GetByUserID(userID string) ([]models.Portfolio, error)
	CountByUserID(userID string) (int64, error)
}

type portfolioRepository struct {
	db *gorm.DB
}

func NewPortfolioRepository(db *gorm.DB) PortfolioRepository {
	return &portfolioRepository{db: db}
}

func (r *portfolioRepository) Create(portfolio *models.Portfolio) error {
	return r.db.Create(portfolio).Error
}

func (r *portfolioRepository) Delete(portfolioID, userID string) error {
	return r.db.Unscoped().Where("id = ? AND user_id = ?", portfolioID, userID).Delete(&models.Portfolio{}).Error
}

func (r *portfolioRepository) GetByUserID(userID string) ([]models.Portfolio, error) {
	var portfolios []models.Portfolio
	err := r.db.Where("user_id = ?", userID).Find(&portfolios).Error
	return portfolios, err
}

func (r *portfolioRepository) CountByUserID(userID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Portfolio{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}
