package repositories

import (
	"backend/internal/models"
	"errors"

	"gorm.io/gorm"
)

type CreditRefundRepository struct {
	db *gorm.DB
}

func NewCreditRefundRepository(db *gorm.DB) *CreditRefundRepository {
	return &CreditRefundRepository{db: db}
}

func (r *CreditRefundRepository) Create(req *models.CreditRefundRequest) error {
	return r.db.Create(req).Error
}

func (r *CreditRefundRepository) UpdateStatus(id, status, adminReason string) error {
	return r.db.Model(&models.CreditRefundRequest{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":       status,
			"admin_reason": adminReason,
		}).Error
}

func (r *CreditRefundRepository) GetByID(id string) (*models.CreditRefundRequest, error) {
	var refund models.CreditRefundRequest
	if err := r.db.First(&refund, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &refund, nil
}

func (r *CreditRefundRepository) GetCreditUsageByID(id string) (*models.CreditUsage, error) {
	var refund models.CreditUsage
	if err := r.db.First(&refund, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &refund, nil
}

func (r *CreditRefundRepository) UpdateCreditUsage(id string) error {
	var usage models.CreditUsage
	if err := r.db.First(&usage, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	usage.Refunded = true
	return r.db.Save(&usage).Error
}

func (r *CreditRefundRepository) WithdrawUsage(id string) error {
	var usage models.CreditUsage
	if err := r.db.First(&usage, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}

	if usage.Reason == "bid" {
		var bid models.JobBid
		if err := r.db.First(&bid, "user_id = ? AND job_id = ?", usage.UserID, usage.JobID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil
			}
			return err
		}
		bid.Status = "withdrawn"
		return r.db.Save(&bid).Error
	} else {
		var invitation models.JobInvitation
		if err := r.db.First(&invitation, "business_id = ? AND job_id = ?", usage.UserID, usage.JobID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil
			}
			return err
		}
		invitation.Status = "withdrawn"
		return r.db.Save(&invitation).Error
	}
}

func (r *CreditRefundRepository) GetByUserID(userID string, limit, offset int) ([]models.CreditRefundRequest, int64, error) {
	var refunds []models.CreditRefundRequest
	var total int64

	query := r.db.Model(&models.CreditRefundRequest{}).Where("user_id = ?", userID)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&refunds).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []models.CreditRefundRequest{}, 0, nil
		}
		return nil, 0, err
	}

	return refunds, total, nil
}

func (r *CreditRefundRepository) GetByAdmin(search, userID, status string, limit, offset int) ([]models.CreditRefundRequest, int64, error) {
	var refunds []models.CreditRefundRequest
	var total int64

	query := r.db.Model(&models.CreditRefundRequest{})

	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Where("id LIKE ? OR credit_usage_id LIKE ?", searchPattern, searchPattern)
	}
	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&refunds).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []models.CreditRefundRequest{}, 0, nil
		}
		return nil, 0, err
	}

	return refunds, total, nil
}

type JobDetailResponse struct {
	JobID          string `json:"job_id"`
	JobTitle       string `json:"job_title"`
	JobDescription string `json:"job_description"`
	JobCategory    string `json:"job_category"`
	JobSpecific    string `json:"job_specific"`
	UserID         string `json:"user_id"`
	UserName       string `json:"user_name"`
	UserEmail      string `json:"user_email"`
	Phone          string `json:"phone"`
	Type           string `json:"type"`
}

func (r *CreditRefundRepository) GetJobDetail(refund string) (*JobDetailResponse, error) {
	var refundDetail models.CreditRefundRequest
	if err := r.db.First(&refundDetail, "id = ?", refund).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	var credit_usage models.CreditUsage
	if err := r.db.First(&credit_usage, "id = ?", refundDetail.CreditUsageID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	var job models.Job
	if err := r.db.First(&job, "id = ?", credit_usage.JobID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	var user models.UserProfile
	if err := r.db.First(&user, "user_id = ?", job.UserID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	var u models.User
	if err := r.db.First(&u, "id = ?", job.UserID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	var response JobDetailResponse
	response.JobID = job.ID
	response.JobTitle = job.Headline
	response.JobDescription = job.Description
	response.JobCategory = job.ServiceCategory
	response.JobSpecific = job.ServiceSpecific
	response.UserID = job.UserID
	response.UserName = user.FirstName + " " + user.LastName
	response.UserEmail = u.Email
	response.Phone = user.Phone
	response.Type = credit_usage.Reason

	return &response, nil
}
