package repositories

import (
	"backend/internal/models"
	"errors"

	"gorm.io/gorm"
)

type JobInvitationRepository interface {
	Create(invite *models.JobInvitation) error
	UpdateStatus(inviteID, status string) error
	GetByID(id string) (*models.JobInvitation, error)
	GetByJobAndBusiness(jobID, businessID string) (*models.JobInvitation, error)
	GetByUser(businessID string) ([]models.JobInvitation, error)
	GetByJob(jobID string) ([]models.JobInvitation, error)
	GetJobByID(jobID string) (models.Job, error)
	GetInvitationsByJobUserID(jobID, userID string) (*models.JobInvitation, error)
	GetAllInvitationJobs(businessID string, limit, offset int) ([]models.Job, int64, error)
	GetInvitationStatusStats(businessID string) (map[string]int64, error)
	GetByJobForUser(jobID, userID string) (*models.JobInvitation, error)
	GetAllAwardedInvitationJobs(businessID string, limit, offset int) ([]models.Job, int64, error)
}

type jobInvitationRepository struct {
	db *gorm.DB
}

func NewJobInvitationRepository(db *gorm.DB) JobInvitationRepository {
	return &jobInvitationRepository{db: db}
}

func (r *jobInvitationRepository) Create(invite *models.JobInvitation) error {
	return r.db.Create(invite).Error
}

func (r *jobInvitationRepository) GetJobByID(jobID string) (models.Job, error) {
	var job models.Job
	if err := r.db.First(&job, "id = ?", jobID).Error; err != nil {
		return job, err
	}
	return job, nil
}

func (r *jobInvitationRepository) UpdateStatus(inviteID, status string) error {
	return r.db.Model(&models.JobInvitation{}).
		Where("id = ?", inviteID).
		Update("status", status).Error
}

func (r *jobInvitationRepository) GetByID(id string) (*models.JobInvitation, error) {
	var invite models.JobInvitation
	if err := r.db.First(&invite, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &invite, nil
}

func (r *jobInvitationRepository) GetByJobAndBusiness(jobID, businessID string) (*models.JobInvitation, error) {
	var invite models.JobInvitation
	if err := r.db.First(&invite, "job_id = ? AND business_id = ?", jobID, businessID).Error; err != nil {
		return nil, err
	}
	return &invite, nil
}

func (r *jobInvitationRepository) GetByUser(businessID string) ([]models.JobInvitation, error) {
	var invites []models.JobInvitation
	if err := r.db.Where("business_id = ?", businessID).Find(&invites).Error; err != nil {
		return nil, err
	}
	return invites, nil
}

func (r *jobInvitationRepository) GetByJob(jobID string) ([]models.JobInvitation, error) {
	var invites []models.JobInvitation
	if err := r.db.Where("job_id = ?", jobID).Find(&invites).Error; err != nil {
		return nil, err
	}
	return invites, nil
}

func (r *jobInvitationRepository) GetByJobForUser(jobID, userID string) (*models.JobInvitation, error) {
	var invites *models.JobInvitation
	if err := r.db.Where("job_id = ? AND business_id = ?", jobID, userID).First(&invites).Error; err != nil {
		return nil, err
	}
	return invites, nil
}

func (r *jobInvitationRepository) GetInvitationsByJobUserID(jobID, userID string) (*models.JobInvitation, error) {
	var invite models.JobInvitation

	err := r.db.Where("job_id = ? AND business_id = ?", jobID, userID).First(&invite).Error
	if err != nil {
		// Gracefully handle "not found" case
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		// For any other DB error, return it
		return nil, err
	}

	return &invite, nil
}

func (r *jobInvitationRepository) GetAllInvitationJobs(businessID string, limit, offset int) ([]models.Job, int64, error) {
	var invites []models.JobInvitation

	// Step 1: Fetch invitations for the business
	if err := r.db.Where("business_id = ? AND status IN ('accepted', 'pending')", businessID).Find(&invites).Error; err != nil {
		return nil, 0, err
	}

	if len(invites) == 0 {
		return []models.Job{}, 0, nil // No invites → return empty slice, no error
	}

	// Step 2: Extract job IDs
	jobIDs := make([]string, 0, len(invites))
	for _, invite := range invites {
		jobIDs = append(jobIDs, invite.JobID)
	}

	// Step 3: Fetch total count for pagination
	var total int64
	if err := r.db.Model(&models.Job{}).Where("id IN ?", jobIDs).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Step 4: Fetch paginated job results
	var jobs []models.Job
	if err := r.db.
		Where("id IN ?", jobIDs).
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *jobInvitationRepository) GetAllAwardedInvitationJobs(businessID string, limit, offset int) ([]models.Job, int64, error) {
	var invites []models.JobInvitation

	// Step 1: Fetch invitations for the business
	if err := r.db.Where("business_id = ? AND status = 'hired'", businessID).Find(&invites).Error; err != nil {
		return nil, 0, err
	}

	if len(invites) == 0 {
		return []models.Job{}, 0, nil // No invites → return empty slice, no error
	}

	// Step 2: Extract job IDs
	jobIDs := make([]string, 0, len(invites))
	for _, invite := range invites {
		jobIDs = append(jobIDs, invite.JobID)
	}

	// Step 3: Fetch total count for pagination
	var total int64
	if err := r.db.Model(&models.Job{}).Where("id IN ?", jobIDs).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Step 4: Fetch paginated job results
	var jobs []models.Job
	if err := r.db.
		Where("id IN ?", jobIDs).
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

type InvitationStatusCount struct {
	Status string `json:"status"`
	Count  int64  `json:"count"`
}

func (r *jobInvitationRepository) GetInvitationStatusStats(businessID string) (map[string]int64, error) {
	var results []InvitationStatusCount

	if err := r.db.Model(&models.JobInvitation{}).
		Select("status, COUNT(*) as count").
		Where("business_id = ?", businessID).
		Group("status").
		Scan(&results).Error; err != nil {
		return nil, err
	}

	stats := map[string]int64{
		"pending":   0,
		"accepted":  0,
		"hired":     0,
		"rejected":  0,
		"withdrawn": 0,
		"total":     0,
	}

	for _, r := range results {
		stats[r.Status] = r.Count
	}
	stats["total"] = stats["pending"] + stats["accepted"] + stats["hired"] + stats["rejected"] + stats["withdrawn"]

	return stats, nil
}
