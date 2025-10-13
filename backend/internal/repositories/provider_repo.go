package repositories

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"gorm.io/gorm"
)

// DTO
type ProfileDTO struct {
	UserID      string   `json:"user_id"`
	FirstName   string   `json:"first_name"`
	LastName    string   `json:"last_name"`
	ImageURL    *string  `json:"image_url,omitempty"`
	AvgRating   float64  `json:"rating"`
	ReviewCount int64    `json:"review_count"`
	About       *string  `json:"about,omitempty"`
	Services    []string `json:"services"`
	City        *string  `json:"city,omitempty"`
	State       *string  `json:"state,omitempty"`
	Country     *string  `json:"country,omitempty"`
}

// Filters
type ProviderFilter struct {
	Services  []string
	Search    *string
	City      *string
	State     *string
	Country   *string
	MinRating *float64
	Limit     int
	Offset    int
}

type UserReview struct {
	Reviewer      string `json:"reviewer"`
	ReviewerImage string `json:"reviewer_image"`
	Rate          int    `json:"rate"`
	Comment       string `json:"comment"`
	CreateAt      string `json:"created_at"`
}

// Repository
type ProviderRepository struct {
	db *gorm.DB
}

func NewProviderRepository(db *gorm.DB) *ProviderRepository {
	return &ProviderRepository{db: db}
}

// GetProviders fetches user profiles with aggregated services, reviews, addresses, and only business users
func (r *ProviderRepository) GetProviders(ctx context.Context, f ProviderFilter) ([]ProfileDTO, error) {
	if f.Limit <= 0 || f.Limit > 200 {
		f.Limit = 50
	}
	if f.Offset < 0 {
		f.Offset = 0
	}

	whereClauses := []string{"1=1"}
	args := []interface{}{}

	// Only business users
	whereClauses = append(whereClauses, "u.role = 'business'")

	// --- Filter by Services ---
	serviceFilterEnabled := false
	if len(f.Services) > 0 {
		placeholders := ""
		for _, s := range f.Services {
			args = append(args, s)
			placeholders += fmt.Sprintf("$%d,", len(args))
		}
		placeholders = placeholders[:len(placeholders)-1]
		whereClauses = append(whereClauses, fmt.Sprintf("s.service_name IN (%s)", placeholders))
		serviceFilterEnabled = true
	}

	// --- Location filters ---
	if f.City != nil && *f.City != "" {
		args = append(args, *f.City)
		whereClauses = append(whereClauses, fmt.Sprintf("ua.city = $%d", len(args)))
	}
	if f.State != nil && *f.State != "" {
		args = append(args, *f.State)
		whereClauses = append(whereClauses, fmt.Sprintf("ua.state = $%d", len(args)))
	}
	if f.Country != nil && *f.Country != "" {
		args = append(args, *f.Country)
		whereClauses = append(whereClauses, fmt.Sprintf("ua.country = $%d", len(args)))
	}

	// --- Search by name ---
	if f.Search != nil && *f.Search != "" {
		searchTerm := "%" + strings.ToLower(*f.Search) + "%"
		args = append(args, searchTerm, searchTerm)
		whereClauses = append(whereClauses,
			fmt.Sprintf("(LOWER(up.first_name) LIKE $%d OR LOWER(up.last_name) LIKE $%d)",
				len(args)-1, len(args)),
		)
	}

	// --- Base Query ---
	query := fmt.Sprintf(`
WITH review_stats AS (
  SELECT
    user_id,
    COALESCE(ROUND(AVG(rate)::numeric, 2), 0) AS avg_rating,
    COALESCE(COUNT(id), 0) AS review_count
  FROM reviews
  GROUP BY user_id
),
service_list AS (
  SELECT
    user_id,
    COALESCE(json_agg(DISTINCT service_name) FILTER (WHERE service_name IS NOT NULL), '[]') AS services_json
  FROM services
  GROUP BY user_id
)
SELECT DISTINCT ON (up.user_id)  -- ✅ ensures unique users
  up.user_id,
  up.first_name,
  up.last_name,
  up.image_url,
  COALESCE(rs.avg_rating, 0) AS avg_rating,
  COALESCE(rs.review_count, 0) AS review_count,
  bi.description AS about,
  COALESCE(sl.services_json, '[]') AS services_json,
  ua.city,
  ua.state,
  ua.country
FROM user_profiles up
INNER JOIN users u ON u.id = up.user_id
LEFT JOIN business_introductions bi ON bi.user_id = up.user_id
LEFT JOIN user_addresses ua ON ua.user_id = up.user_id
LEFT JOIN review_stats rs ON rs.user_id = up.user_id
LEFT JOIN service_list sl ON sl.user_id = up.user_id
%s
WHERE %s
`,
		// only join `services s` when filtering by service name
		func() string {
			if serviceFilterEnabled {
				return "LEFT JOIN services s ON s.user_id = up.user_id"
			}
			return ""
		}(),
		joinClauses(whereClauses, " AND "),
	)

	// --- Min Rating Filter ---
	if f.MinRating != nil {
		args = append(args, *f.MinRating)
		query += fmt.Sprintf(" AND COALESCE(rs.avg_rating, 0) >= $%d", len(args))
	}

	// --- Sorting & Pagination ---
	query += fmt.Sprintf(`
ORDER BY up.user_id, rs.avg_rating DESC NULLS LAST, rs.review_count DESC
LIMIT %d OFFSET %d
`, f.Limit, f.Offset)

	// --- Execute Query ---
	rows, err := r.db.WithContext(ctx).Raw(query, args...).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := make([]ProfileDTO, 0, 32)
	for rows.Next() {
		var (
			userID       string
			firstName    string
			lastName     string
			imageURL     sql.NullString
			avgRating    float64
			reviewCnt    int64
			aboutNull    sql.NullString
			servicesJSON []byte
			cityNull     sql.NullString
			stateNull    sql.NullString
			countryNull  sql.NullString
		)
		if err := rows.Scan(&userID, &firstName, &lastName, &imageURL, &avgRating, &reviewCnt,
			&aboutNull, &servicesJSON, &cityNull, &stateNull, &countryNull); err != nil {
			return nil, err
		}

		var services []string
		if len(servicesJSON) > 0 {
			if err := json.Unmarshal(servicesJSON, &services); err != nil {
				services = []string{}
			}
		}

		if len(services) == 0 {
			var getServices []models.Service
			if err := r.db.Where("user_id = ?", userID).Find(&getServices).Error; err == nil {
				services = make([]string, len(getServices))
				for i, s := range getServices {
					services[i] = s.ServiceName
				}
			}
		}

		dto := ProfileDTO{
			UserID:      userID,
			FirstName:   firstName,
			LastName:    lastName,
			AvgRating:   avgRating,
			ReviewCount: reviewCnt,
			About:       nilIfEmpty(aboutNull),
			Services:    services,
			City:        nilIfEmpty(cityNull),
			State:       nilIfEmpty(stateNull),
			Country:     nilIfEmpty(countryNull),
		}
		if imageURL.Valid {
			dto.ImageURL = &imageURL.String
		}
		results = append(results, dto)
	}

	return results, nil
}

// Utilities
func joinClauses(clauses []string, delim string) string {
	out := ""
	for i, c := range clauses {
		if i > 0 {
			out += delim
		}
		out += c
	}
	return out
}

func nilIfEmpty(ns sql.NullString) *string {
	if !ns.Valid || ns.String == "" {
		return nil
	}
	return &ns.String
}

type ProviderDetail struct {
	Profile              models.UserProfile
	Address              models.UserAddress
	Review               []UserReview
	Rate                 int64
	ReviewCount          int64
	Portfolio            []models.Portfolio
	Service              []models.Service
	Qualification        []models.Qualification
	BusinessIntroduction models.BusinessIntroduction
}

func (r *ProviderRepository) GetByUserID(ctx context.Context, userID string) (ProviderDetail, error) {
	var detail ProviderDetail
	var user models.User

	if err := r.db.WithContext(ctx).
		Where("id = ? AND role = ?", userID, "business").
		First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return detail, errors.New("user not found or not a business account")
		}
		return detail, err
	}

	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		First(&detail.Profile).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return detail, err
	}

	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		First(&detail.Address).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return detail, err
	}

	var jobBid []models.JobBid
	err := r.db.Where("user_id = ?", userID).Find(&jobBid).Error
	if err != nil {
		return detail, err
	}
	jobIds := make([]string, 0, len(jobBid))
	for _, jb := range jobBid {
		jobIds = append(jobIds, jb.JobID)
	}
	var reviews []models.Review
	err = r.db.Where("job_id IN ?", jobIds).Find(&reviews).Error
	if err != nil {
		return detail, err
	}

	reviewWithUser := make([]UserReview, 0, len(reviews))
	for _, rew := range reviews {
		userProfile, err := r.GetUserByIdClient(rew.ReviewerID)
		if err != nil {
			return detail, nil
		}
		ur := UserReview{
			Reviewer:      userProfile.FirstName + " " + userProfile.LastName,
			ReviewerImage: userProfile.ImageURL,
			Rate:          rew.Rate,
			Comment:       rew.Comment,
			CreateAt:      rew.CreatedAt.Format("02-01-2006"),
		}
		reviewWithUser = append(reviewWithUser, ur)
	}

	detail.Review = reviewWithUser
	detail.ReviewCount = int64(len(reviews))

	if len(reviews) > 0 {
		var totalRating int64
		for _, r := range reviews {
			totalRating += int64(r.Rate)
		}
		detail.Rate = totalRating / int64(len(reviews))
	}

	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&detail.Portfolio).Error; err != nil {
		return detail, err
	}

	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&detail.Service).Error; err != nil {
		return detail, err
	}

	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&detail.Qualification).Error; err != nil {
		return detail, err
	}

	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		First(&detail.BusinessIntroduction).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return detail, err
	}

	return detail, nil
}

func (r *ProviderRepository) GetUserByIdClient(userId string) (*models.UserProfile, error) {
	var user models.UserProfile
	err := r.db.First(&user, "user_id = ?", userId).Error
	if err != nil {
		return nil, err
	}
	return &user, nil

}
