package repositories

import (
	"backend/internal/models"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type AdminJobRepository struct {
	db *gorm.DB
}

func NewAdminJobRepository(db *gorm.DB) *AdminJobRepository {
	return &AdminJobRepository{db: db}
}

type JobDetail struct {
	Job       models.Job         `json:"job"`
	CreatedBy models.UserProfile `json:"created_by"`
	Bids      []BidDTO           `json:"bids"`
	Invites   []InvitationDTO    `json:"invites"`
}

func (r *AdminJobRepository) GetJobs(limit, offset int, search, status string) ([]JobDetail, int64, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	query := r.db.Model(&models.Job{})

	// --- ✅ Filter by job status if provided ---
	if status != "" {
		status = strings.ToLower(strings.TrimSpace(status))
		allowedStatuses := map[string]bool{
			"open":    true,
			"closed":  true,
			"awarded": true,
		}
		if allowedStatuses[status] {
			query = query.Where("status = ?", status)
		} else {
			return nil, 0, errors.New("invalid job status filter: must be 'open', 'closed', or 'awarded'")
		}
	}

	// --- ✅ Apply search filter if provided ---
	if search != "" {
		search = strings.TrimSpace(search)
		likeQuery := "%" + search + "%"
		query = query.Where("headline ILIKE ?", likeQuery)
	}

	// --- ✅ Count total results ---
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// --- ✅ Fetch paginated jobs ---
	var jobs []models.Job
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&jobs).Error; err != nil {
		return nil, 0, err
	}
	if len(jobs) == 0 {
		return []JobDetail{}, total, nil
	}

	jobIDs := make([]string, len(jobs))
	for i, j := range jobs {
		jobIDs[i] = j.ID
	}

	// --- ✅ Fetch related bids and invitations ---
	var bids []models.JobBid
	if err := r.db.Where("job_id IN ?", jobIDs).Find(&bids).Error; err != nil {
		return nil, 0, err
	}

	var invites []models.JobInvitation
	if err := r.db.Where("job_id IN ?", jobIDs).Find(&invites).Error; err != nil {
		return nil, 0, err
	}

	// --- ✅ Collect all unique user IDs for profiles ---
	userIDs := make(map[string]bool)
	for _, b := range bids {
		userIDs[b.UserID] = true
	}
	for _, i := range invites {
		userIDs[i.BusinessID] = true
	}

	// --- ✅ Fetch user profiles in bulk ---
	var profiles []models.UserProfile
	if err := r.db.Where("user_id IN ?", keys(userIDs)).Find(&profiles).Error; err != nil {
		return nil, 0, err
	}

	profileMap := make(map[string]models.UserProfile)
	for _, p := range profiles {
		profileMap[p.UserID] = p
	}

	// --- ✅ Map bids ---
	bidMap := make(map[string][]BidDTO)
	for _, b := range bids {
		profile, ok := profileMap[b.UserID]
		if !ok {
			return nil, 0, errors.New("missing profile for bidder: " + b.UserID)
		}
		bidMap[b.JobID] = append(bidMap[b.JobID], BidDTO{
			JobId:      b.JobID,
			BidId:      b.ID,
			Status:     b.Status,
			UserDetail: profile,
			CreatedAt:  b.CreatedAt,
		})
	}

	// --- ✅ Map invites ---
	inviteMap := make(map[string][]InvitationDTO)
	for _, i := range invites {
		profile, ok := profileMap[i.BusinessID]
		if !ok {
			continue
		}
		inviteMap[i.JobID] = append(inviteMap[i.JobID], InvitationDTO{
			JobId:      i.JobID,
			InviteId:   i.ID,
			Status:     i.Status,
			UserDetail: profile,
			CreatedAt:  i.CreatedAt,
		})
	}

	// --- ✅ Build final job details ---
	var results []JobDetail
	for _, j := range jobs {
		var userProfile models.UserProfile
		if err := r.db.Where("user_id = ?", j.UserID).First(&userProfile).Error; err != nil {
			return nil, 0, err
		}

		results = append(results, JobDetail{
			Job:       j,
			CreatedBy: userProfile,
			Bids:      bidMap[j.ID],
			Invites:   inviteMap[j.ID],
		})
	}

	return results, total, nil
}

func keys(m map[string]bool) []string {
	out := make([]string, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
}
