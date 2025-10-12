package repositories

import (
	"backend/internal/models"

	"gorm.io/gorm"
)

type ReviewRepository interface {
	Create(review *models.Review) error
	Update(review *models.Review) error
	GetByID(id string) (*models.Review, error)
	GetByJobAndReviewer(jobID, reviewerID string) (*models.Review, error)
	GetByUserJobs(userID string) ([]models.Review, error)
	GetAverageRating(userID string) (float64, error)
	GetUserById(userId string) (*models.UserProfile, error)
	GetAllReviewsUser(user_id string) ([]models.Review, error)
	GetJobByID(jobID string) (models.Job, error)
	GetUserByClient(userId string) (*models.UserProfile, error)
}

type reviewRepository struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) Create(review *models.Review) error {
	return r.db.Create(review).Error
}

func (r *reviewRepository) Update(review *models.Review) error {
	return r.db.Save(review).Error
}

func (r *reviewRepository) GetByID(id string) (*models.Review, error) {
	var review models.Review
	if err := r.db.First(&review, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *reviewRepository) GetJobByID(jobID string) (models.Job, error) {
	var reviews models.Job
	err := r.db.Where("id = ?", jobID).First(&reviews).Error
	if err != nil {
		return reviews, err
	}
	return reviews, nil
}

func (r *reviewRepository) GetByJobAndReviewer(jobID, reviewerID string) (*models.Review, error) {
	var review models.Review
	err := r.db.Where("job_id = ? AND reviewer_id = ?", jobID, reviewerID).First(&review).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}

// Get reviews of all jobs posted by a user
func (r *reviewRepository) GetByUserJobs(userID string) ([]models.Review, error) {
	var reviews []models.Review
	err := r.db.
		Raw(`
			SELECT r.* 
			FROM reviews r
			INNER JOIN jobs j ON r.job_id = j.id
			WHERE j.user_id = ?
			ORDER BY r.created_at DESC
		`, userID).Scan(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *reviewRepository) GetAllReviewsUser(user_id string) ([]models.Review, error) {
	var reviews []models.Review
	err := r.db.Where("user_id = ?", user_id).Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *reviewRepository) GetAverageRating(userID string) (float64, error) {
	var avg float64
	err := r.db.
		Raw(`
			SELECT COALESCE(AVG(r.rate),0) 
			FROM reviews r
			INNER JOIN jobs j ON r.job_id = j.id
			WHERE j.user_id = ?
		`, userID).Scan(&avg).Error
	if err != nil {
		return 0, err
	}
	return avg, nil
}

func (r *reviewRepository) GetUserById(userId string) (*models.UserProfile, error) {
	var user models.UserProfile
	err := r.db.First(&user, "id = ?", userId).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *reviewRepository) GetUserByClient(userId string) (*models.UserProfile, error) {
	var user models.UserProfile
	err := r.db.First(&user, "user_id = ?", userId).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *reviewRepository) GetAllUserReviewsById(userId string) ([]models.Review, error) {
	var jobBid []models.JobBid
	err := r.db.Where("user_id = ?", userId).Find(&jobBid).Error
	if err != nil {
		return nil, err
	}
	jobIds := make([]string, 0, len(jobBid))
	for _, jb := range jobBid {
		jobIds = append(jobIds, jb.JobID)
	}
	var reviews []models.Review
	err = r.db.Where("job_id IN ?", jobIds).Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}
