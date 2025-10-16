package repositories

import (
	"backend/internal/models"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type BusinessDashBoard struct {
	ID                string
	CompletedJobs     int
	OpenJobs          int
	Rating            int
	ReviewCount       float32
	TotalBids         int
	TotalShortlisted  int
	TotalHired        int
	TotalBidCompleted int
	TotalPending      int
}

type JobBidStatusGroup struct {
	Status string          `json:"status"`
	Bids   json.RawMessage `json:"bids"`
}

type DashBoardRepository struct {
	db *gorm.DB
}

func NewDashBoardRepository(db *gorm.DB) *DashBoardRepository {
	return &DashBoardRepository{db: db}
}

func (r *DashBoardRepository) GetBusinessDashboard(userID string) (*BusinessDashBoard, error) {
	var dashboard BusinessDashBoard
	var review []models.Review

	counts := map[string]int{
		"pending":     0,
		"shortlisted": 0,
		"rejected":    0,
		"invites":     0,
		"hired":       0,
		"completed":   0,
	}

	type StatusCount struct {
		Status string
		Total  int
	}

	var results []StatusCount

	query := `
		SELECT status, COUNT(*) AS total
		FROM job_bids
		WHERE user_id = ?
		GROUP BY status;
	`

	if err := r.db.Raw(query, userID).Scan(&results).Error; err != nil {
		return nil, err
	}

	for _, row := range results {
		if _, ok := counts[row.Status]; ok {
			counts[row.Status] = row.Total
		}
	}

	dashboard.ID = userID
	dashboard.CompletedJobs = counts["completed"]
	dashboard.OpenJobs = counts["hired"]
	dashboard.TotalBids = counts["pending"] + counts["shortlisted"] + counts["rejected"] + counts["invites"] + counts["hired"] + counts["completed"]
	dashboard.TotalShortlisted = counts["shortlisted"]
	dashboard.TotalHired = counts["hired"]
	dashboard.TotalBidCompleted = counts["completed"]
	dashboard.TotalPending = counts["pending"]

	if err := r.db.Where("user_id = ?", userID).Find(&review).Error; err != nil {
		return nil, err
	}
	dashboard.ReviewCount = float32(len(review))
	dashboard.Rating = 0
	if len(review) > 0 {
		var totalRating int
		for _, r := range review {
			totalRating += r.Rate
		}
		dashboard.Rating = totalRating / len(review)
	}

	return &dashboard, nil

}

func (r *DashBoardRepository) GetProfileView(userID string, lastDay int) ([]models.ProfileView, error) {
	var profileViews []models.ProfileView

	startDate := time.Now().AddDate(0, 0, -lastDay)

	err := r.db.
		Where("user_id = ? AND created_at >= ?", userID, startDate).
		Order("created_at DESC").
		Find(&profileViews).Error

	if err != nil {
		return nil, err
	}

	return profileViews, nil
}

func (r *DashBoardRepository) CreateProfileView(userID string) error {
	profileView := &models.ProfileView{
		UserID:    userID,
		CreatedAt: time.Now(),
	}
	return r.db.Create(profileView).Error
}
