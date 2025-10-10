package repositories

import (
	"backend/internal/models"
	"fmt"

	"gorm.io/gorm"
)

type JobBidRepository interface {
	Create(bid *models.JobBid) error
	UpdateStatus(bidID, status string) error
	GetByID(id string) (*models.JobBid, error)
	GetByJobAndUser(jobID, userID string) (*models.JobBid, error)
	GetByJobID(jobID string) ([]models.JobBid, error)
	GetByUserID(userID string) (int, error)
	GetBidStatsByUserID(userID string) (*models.BidStats, error)
	GetShortlistedJobs(userID string, limit, offset int) ([]models.Job, int64, error)
	GetAllBidsForJobByState(jobID string) (map[string][]models.UserProfileWithRating, error)
	GetUserID(userId string) (string, error)
	GetBidStatsByJobID(jobID string) (map[string]int64, error)
	GetAwardedJobs(userID string, limit, offset int) ([]models.Job, int64, error)
	UpdateJobStatus(jobID, status string) error
	GetJobByID(jobID string) (models.Job, error)
}

type jobBidRepository struct {
	db *gorm.DB
}

func NewJobBidRepository(db *gorm.DB) JobBidRepository {
	return &jobBidRepository{db: db}
}

func (r *jobBidRepository) Create(bid *models.JobBid) error {
	return r.db.Create(bid).Error
}

func (r *jobBidRepository) UpdateStatus(bidID, status string) error {
	return r.db.Model(&models.JobBid{}).
		Where("id = ?", bidID).
		Update("status", status).Error
}

func (r *jobBidRepository) GetByID(id string) (*models.JobBid, error) {
	var bid models.JobBid
	if err := r.db.First(&bid, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &bid, nil
}

func (r *jobBidRepository) GetJobByID(jobID string) (models.Job, error) {
	var job models.Job
	if err := r.db.First(&job, "id = ?", jobID).Error; err != nil {
		return job, err
	}
	return job, nil
}

func (r *jobBidRepository) GetByJobAndUser(jobID, userID string) (*models.JobBid, error) {
	var bid models.JobBid
	if err := r.db.First(&bid, "job_id = ? AND user_id = ?", jobID, userID).Error; err != nil {
		return nil, err
	}
	return &bid, nil
}

func (r *jobBidRepository) GetByJobID(jobID string) ([]models.JobBid, error) {
	var bids []models.JobBid
	if err := r.db.Where("job_id = ?", jobID).Find(&bids).Error; err != nil {
		return nil, err
	}
	return bids, nil
}

func (r *jobBidRepository) GetByUserID(userID string) (int, error) {
	var bids []models.JobBid
	if err := r.db.Where("user_id = ?", userID).Find(&bids).Error; err != nil {
		return 0, err
	}
	return len(bids), nil
}

func (r *jobBidRepository) GetBidStatsByUserID(userID string) (*models.BidStats, error) {
	var results []struct {
		Status string
		Count  int
	}

	// Group and count bids by status
	if err := r.db.Model(&models.JobBid{}).
		Select("status, COUNT(*) as count").
		Where("user_id = ?", userID).
		Group("status").
		Scan(&results).Error; err != nil {
		return nil, err
	}

	stats := &models.BidStats{}
	for _, res := range results {
		switch res.Status {
		case "shortlisted":
			stats.Shortlisted = res.Count
		case "hired":
			stats.Hired = res.Count
		case "rejected":
			stats.Rejected = res.Count
		case "withdrawn":
			stats.Withdrawn = res.Count
		case "completed":
			stats.Completed = res.Count
		case "pending":
			stats.Pending = res.Count
		}
		stats.Total += res.Count
	}

	return stats, nil
}

func (r *jobBidRepository) GetShortlistedJobs(userID string, limit, offset int) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	// Count total shortlisted jobs for pagination metadata
	if err := r.db.Model(&models.JobBid{}).
		Where("user_id = ? AND status = 'shortlisted'", userID).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Efficient JOIN to avoid N+1 query problem
	if err := r.db.
		Table("job_bids").
		Select("jobs.*").
		Joins("JOIN jobs ON jobs.id = job_bids.job_id").
		Where("job_bids.user_id = ? AND job_bids.status = 'shortlisted'", userID).
		Order("jobs.created_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *jobBidRepository) GetAwardedJobs(userID string, limit, offset int) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	// Count total shortlisted jobs for pagination metadata
	if err := r.db.Model(&models.JobBid{}).
		Where("user_id = ? AND status IN ?", userID, []string{"hired", "completed"}).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Efficient JOIN to avoid N+1 query problem (fetch jobs for hired + completed bids)
	if err := r.db.
		Table("job_bids").
		Select("jobs.*").
		Joins("JOIN jobs ON jobs.id = job_bids.job_id").
		Where("job_bids.user_id = ? AND job_bids.status IN ?", userID, []string{"hired", "completed"}).
		Order("jobs.created_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *jobBidRepository) GetAllBidsForJobByState(jobID string) (map[string][]models.UserProfileWithRating, error) {
	result := map[string][]models.UserProfileWithRating{
		"pending":     {},
		"shortlisted": {},
		"rejected":    {},
		"invites":     {},
		"hired":       {},
		"completed":   {},
	}

	type BidUser struct {
		models.UserProfile
		Status        string
		AverageRating float64
		ReviewCount   int
	}

	var bidUsers []BidUser

	// --- Fetch users who placed bids with their rating stats ---
	if err := r.db.
		Table("user_profiles").
		Select(`
			user_profiles.id,
			user_profiles.user_id,
			user_profiles.first_name,
			user_profiles.last_name,
			user_profiles.phone,
			user_profiles.image_url,
			user_profiles.address_id,
			user_profiles.created_at,
			user_profiles.updated_at,
			job_bids.status,
			COALESCE(AVG(reviews.rate), 0) AS average_rating,
			COUNT(reviews.id) AS review_count
		`).
		Joins("JOIN job_bids ON job_bids.user_id = user_profiles.user_id").
		Joins("LEFT JOIN reviews ON reviews.reviewer_id = user_profiles.user_id").
		Where("job_bids.job_id = ? AND job_bids.status IN ?", jobID, []string{"pending", "shortlisted", "rejected", "hired", "completed"}).
		Group(`
			user_profiles.id,
			user_profiles.user_id,
			user_profiles.first_name,
			user_profiles.last_name,
			user_profiles.phone,
			user_profiles.image_url,
			user_profiles.address_id,
			user_profiles.created_at,
			user_profiles.updated_at,
			job_bids.status
		`).
		Scan(&bidUsers).Error; err != nil {
		return nil, err
	}

	for _, user := range bidUsers {
		result[user.Status] = append(result[user.Status], models.UserProfileWithRating{
			UserProfile:   user.UserProfile,
			AverageRating: user.AverageRating,
			ReviewCount:   user.ReviewCount,
		})
	}

	// --- Fetch invited users with rating stats ---
	var invitedUsers []models.UserProfileWithRating
	if err := r.db.
		Table("user_profiles").
		Select(`
			user_profiles.id,
			user_profiles.user_id,
			user_profiles.first_name,
			user_profiles.last_name,
			user_profiles.phone,
			user_profiles.image_url,
			user_profiles.address_id,
			user_profiles.created_at,
			user_profiles.updated_at,
			COALESCE(AVG(reviews.rate), 0) AS average_rating,
			COUNT(reviews.id) AS review_count
		`).
		Joins("JOIN job_invitations ON job_invitations.business_id = user_profiles.user_id").
		Joins("LEFT JOIN reviews ON reviews.reviewer_id = user_profiles.user_id").
		Where("job_invitations.job_id = ?", jobID).
		Where("job_invitations.status In ('pending', 'accepted','completed')").
		Group(`
			user_profiles.id,
			user_profiles.user_id,
			user_profiles.first_name,
			user_profiles.last_name,
			user_profiles.phone,
			user_profiles.image_url,
			user_profiles.address_id,
			user_profiles.created_at,
			user_profiles.updated_at
		`).
		Scan(&invitedUsers).Error; err != nil {
		return nil, err
	}

	result["invites"] = invitedUsers

	var invitedUsersHired []models.UserProfileWithRating
	if err := r.db.
		Table("user_profiles").
		Select(`
			user_profiles.id,
			user_profiles.user_id,
			user_profiles.first_name,
			user_profiles.last_name,
			user_profiles.phone,
			user_profiles.image_url,
			user_profiles.address_id,
			user_profiles.created_at,
			user_profiles.updated_at,
			COALESCE(AVG(reviews.rate), 0) AS average_rating,
			COUNT(reviews.id) AS review_count
		`).
		Joins("JOIN job_invitations ON job_invitations.business_id = user_profiles.user_id").
		Joins("LEFT JOIN reviews ON reviews.reviewer_id = user_profiles.user_id").
		Where("job_invitations.job_id = ?", jobID).
		Where("job_invitations.status = 'hired'").
		Group(`
			user_profiles.id,
			user_profiles.user_id,
			user_profiles.first_name,
			user_profiles.last_name,
			user_profiles.phone,
			user_profiles.image_url,
			user_profiles.address_id,
			user_profiles.created_at,
			user_profiles.updated_at
		`).
		Scan(&invitedUsersHired).Error; err != nil {
		return nil, err
	}
	result["hired"] = append(result["hired"], invitedUsersHired...)

	return result, nil
}

func (r *jobBidRepository) GetUserID(userId string) (string, error) {

	var user models.UserProfile
	if err := r.db.First(&user, "id = ?", userId).Error; err != nil {
		return "", err
	}
	return user.UserID, nil
}

func (r *jobBidRepository) GetBidStatsByJobID(jobID string) (map[string]int64, error) {
	type result struct {
		Status string
		Count  int64
	}

	var results []result
	var resultsInvite []result

	query := `
		SELECT 
			status,
			COUNT(*) AS count
		FROM job_bids
		WHERE job_id = ?
		GROUP BY status
	`

	if err := r.db.Raw(query, jobID).Scan(&results).Error; err != nil {
		return nil, fmt.Errorf("querying bid stats: %w", err)
	}

	queryInvite := `
		SELECT 
			status,
			COUNT(*) AS count
		FROM job_invitations
		WHERE job_id = ?
		GROUP BY status
	`

	if err := r.db.Raw(queryInvite, jobID).Scan(&resultsInvite).Error; err != nil {
		return nil, fmt.Errorf("querying bid stats: %w", err)
	}

	stats := map[string]int64{
		"pending":     0,
		"shortlisted": 0,
		"hired":       0,
		"invites":     0,
		"accepted":    0,
		"rejected":    0,
		"withdrawn":   0,
	}

	var total int64

	for _, res := range resultsInvite {
		if res.Status == "pending" || res.Status == "completed" || res.Status == "rejected" || res.Status == "withdrawn" {
			stats["invites"] = res.Count
			total += res.Count
			continue
		}
		stats[res.Status] = res.Count
		total += res.Count
	}

	for _, res := range results {
		stats[res.Status] = res.Count
		total += res.Count
	}

	stats["total"] = total
	return stats, nil
}

func (r *jobBidRepository) UpdateJobStatus(jobID, status string) error {
	return r.db.Model(&models.Job{}).
		Where("id = ?", jobID).
		Update("status", status).Error
}
