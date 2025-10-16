package repositories

import (
	"backend/internal/models"
	"strings"
	"time"

	"gorm.io/gorm"
)

type UserFilter struct {
	Role             string
	Status           string
	EmailVerified    *bool
	IdentityVerified *bool
	Search           string
	CreatedAfter     *time.Time
	CreatedBefore    *time.Time
	Limit            int
	Offset           int
}

type AdminUserRepository struct {
	db *gorm.DB
}

func NewAdminUserRepository(db *gorm.DB) *AdminUserRepository {
	return &AdminUserRepository{db: db}
}

type UserDTO struct {
	ID               string    `json:"id"`
	Email            string    `json:"email"`
	Role             string    `json:"role"`
	Status           string    `json:"status"`
	FirstName        string    `json:"first_name"`
	LastName         string    `json:"last_name"`
	Phone            string    `json:"phone"`
	ImageURL         string    `json:"image_url"`
	EmailVerified    bool      `json:"email_verified"`
	IdentityVerified bool      `json:"identity_verified"`
	CreatedAt        time.Time `json:"created_at"`
}

type BidDTO struct {
	JobId      string             `json:"job_id"`
	BidId      string             `json:"bid_id"`
	Status     string             `json:"status"`
	UserDetail models.UserProfile `json:"user_detail"`
	CreatedAt  time.Time          `json:"created_at"`
}

type InvitationDTO struct {
	JobId      string             `json:"job_id"`
	InviteId   string             `json:"invite_id"`
	Status     string             `json:"status"`
	UserDetail models.UserProfile `json:"user_detail"`
	CreatedAt  time.Time          `json:"created_at"`
}

type JobDTO struct {
	Job     models.Job      `json:"job"`
	Bids    []BidDTO        `json:"bids"`
	Invites []InvitationDTO `json:"invites"`
}

type JobIntent struct {
	Job    models.Job
	Type   string
	Status string
}

func (r *AdminUserRepository) GetUsers(filter UserFilter) ([]UserDTO, int64, error) {
	var users []UserDTO
	var count int64

	query := r.db.Table("users AS u").
		Select(`
        u.id, u.email, u.role, u.status, u.created_at,
        up.first_name, up.last_name, up.phone, up.image_url,
        COALESCE(MAX(CASE WHEN uv.type = 'email' THEN (uv.verified::int) END) > 0, false) AS email_verified,
        COALESCE(MAX(CASE WHEN uv.type = 'identity' THEN (uv.verified::int) END) > 0, false) AS identity_verified
    `).
		Joins("LEFT JOIN user_profiles up ON up.user_id = u.id").
		Joins("LEFT JOIN user_verifications uv ON uv.user_id = u.id").
		Group("u.id, up.first_name, up.last_name, up.phone, up.image_url")

	// --- Filtering ---
	if filter.Role != "" {
		query = query.Where("u.role = ?", filter.Role)
	}
	if filter.Status != "" {
		query = query.Where("u.status = ?", filter.Status)
	}
	if filter.CreatedAfter != nil {
		query = query.Where("u.created_at >= ?", *filter.CreatedAfter)
	}
	if filter.CreatedBefore != nil {
		query = query.Where("u.created_at <= ?", *filter.CreatedBefore)
	}
	if filter.EmailVerified != nil {
		query = query.Having("MAX(CASE WHEN uv.type = 'email' THEN uv.verified END) = ?", *filter.EmailVerified)
	}
	if filter.IdentityVerified != nil {
		query = query.Having("MAX(CASE WHEN uv.type = 'identity' THEN uv.verified END) = ?", *filter.IdentityVerified)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where(`
			LOWER(u.email) LIKE ? OR LOWER(up.first_name) LIKE ? OR LOWER(up.last_name) LIKE ?`,
			like, like, like,
		)
	}

	// Count total before pagination
	err := query.Count(&count).Error
	if err != nil {
		return nil, 0, err
	}

	// Pagination defaults
	if filter.Limit == 0 {
		filter.Limit = 20
	}
	if filter.Offset < 0 {
		filter.Offset = 0
	}

	err = query.Limit(filter.Limit).Offset(filter.Offset).Order("u.created_at DESC").Scan(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, count, nil
}

func (r *AdminUserRepository) GetUserByIDClient(id string) (*UserDTO, []JobDTO, error) {
	var jobDTOs []JobDTO
	var jobs []models.Job
	var user models.User
	var userProfile models.UserProfile
	var userVerificationEmail models.UserVerification
	var userVerificationIdentity models.UserVerification

	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, nil, err
	}

	if err := r.db.Where("user_id = ?", id).First(&userProfile).Error; err != nil {
		return nil, nil, err
	}
	if err := r.db.Where("user_id = ? AND type = ?", id, "email").First(&userVerificationEmail).Error; err != nil {
		return nil, nil, err
	}

	if err := r.db.Where("user_id = ? AND type = ?", id, "identity").First(&userVerificationIdentity).Error; err != nil {
		return nil, nil, err
	}

	userProfileDTO := UserDTO{
		ID:               userProfile.ID,
		Email:            user.Email,
		Role:             user.Role,
		Status:           user.Status,
		FirstName:        userProfile.FirstName,
		LastName:         userProfile.LastName,
		Phone:            userProfile.Phone,
		ImageURL:         userProfile.ImageURL,
		EmailVerified:    userVerificationEmail.Verified,
		IdentityVerified: userVerificationIdentity.Verified,
		CreatedAt:        userProfile.CreatedAt,
	}

	if err := r.db.Where("user_id = ?", id).Find(&jobs).Error; err != nil {
		return nil, nil, err
	}

	for _, job := range jobs {
		var bidsDTO []BidDTO
		var invitesDTo []InvitationDTO

		var bids []models.JobBid
		var invites []models.JobInvitation

		if err := r.db.Where("job_id = ?", job.ID).Find(&bids).Error; err != nil {
			return nil, nil, err
		}

		for _, bid := range bids {
			var userProfile models.UserProfile
			if err := r.db.Where("user_id = ?", bid.UserID).First(&userProfile).Error; err != nil {
				return nil, nil, err
			}
			bidsDTO = append(bidsDTO, BidDTO{
				JobId:      bid.JobID,
				BidId:      bid.ID,
				Status:     bid.Status,
				UserDetail: userProfile,
				CreatedAt:  bid.CreatedAt,
			})
		}

		if err := r.db.Where("job_id = ?", job.ID).Find(&invites).Error; err != nil {
			return nil, nil, err
		}
		for _, invite := range invites {
			var userProfile models.UserProfile
			if err := r.db.Where("user_id = ?", invite.BusinessID).First(&userProfile).Error; err != nil {
				return nil, nil, err
			}
			invitesDTo = append(invitesDTo, InvitationDTO{
				JobId:      invite.JobID,
				InviteId:   invite.ID,
				Status:     invite.Status,
				UserDetail: userProfile,
				CreatedAt:  invite.CreatedAt,
			})
		}
		jobDTOs = append(jobDTOs, JobDTO{
			Job:     job,
			Bids:    bidsDTO,
			Invites: invitesDTo,
		})

	}
	return &userProfileDTO, jobDTOs, nil
}

func (r *AdminUserRepository) GetUserByIDBusiness(id string) (*UserDTO, []JobIntent, error) {
	var user models.User
	var userProfile models.UserProfile
	var userVerificationEmail models.UserVerification
	var userVerificationIdentity models.UserVerification

	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, nil, err
	}

	if err := r.db.Where("user_id = ?", id).First(&userProfile).Error; err != nil {
		return nil, nil, err
	}
	if err := r.db.Where("user_id = ? AND type = ?", id, "email").First(&userVerificationEmail).Error; err != nil {
		return nil, nil, err
	}

	if err := r.db.Where("user_id = ? AND type = ?", id, "identity").First(&userVerificationIdentity).Error; err != nil {
		return nil, nil, err
	}

	userProfileDTO := UserDTO{
		ID:               userProfile.ID,
		Email:            user.Email,
		Role:             user.Role,
		Status:           user.Status,
		FirstName:        userProfile.FirstName,
		LastName:         userProfile.LastName,
		Phone:            userProfile.Phone,
		ImageURL:         userProfile.ImageURL,
		EmailVerified:    userVerificationEmail.Verified,
		IdentityVerified: userVerificationIdentity.Verified,
		CreatedAt:        userProfile.CreatedAt,
	}

	var JobIntents []JobIntent
	var JobBids []models.JobBid
	var JobInvites []models.JobInvitation

	if err := r.db.Where("user_id = ?", id).Find(&JobBids).Error; err != nil {
		return nil, nil, err
	}

	for _, bid := range JobBids {
		var job models.Job
		if err := r.db.Where("id = ?", bid.JobID).First(&job).Error; err != nil {
			return nil, nil, err
		}
		JobIntents = append(JobIntents, JobIntent{
			Job:    job,
			Type:   "bid",
			Status: bid.Status,
		})
	}

	if err := r.db.Where("business_id = ?", id).Find(&JobInvites).Error; err != nil {
		return nil, nil, err
	}
	for _, invite := range JobInvites {
		var job models.Job
		if err := r.db.Where("id = ?", invite.JobID).First(&job).Error; err != nil {
			return nil, nil, err
		}
		JobIntents = append(JobIntents, JobIntent{
			Job:    job,
			Type:   "invite",
			Status: invite.Status,
		})
	}

	return &userProfileDTO, JobIntents, nil
}
