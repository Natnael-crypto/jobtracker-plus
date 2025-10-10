package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"time"

	"github.com/google/uuid"
)

type ReviewService struct {
	repo repositories.ReviewRepository
}

func NewReviewService(repo repositories.ReviewRepository) *ReviewService {
	return &ReviewService{repo: repo}
}

func (s *ReviewService) Create(jobID, reviewerID string, rate int, comment string) (*models.Review, error) {
	if rate < 1 || rate > 5 {
		return nil, errors.New("rate must be between 1 and 5")
	}

	// Prevent duplicate reviews for the same job by same reviewer
	if _, err := s.repo.GetByJobAndReviewer(jobID, reviewerID); err == nil {
		return nil, errors.New("review already exists for this job")
	}

	review := &models.Review{
		ID:         uuid.NewString(),
		JobID:      jobID,
		ReviewerID: reviewerID,
		Rate:       rate,
		Comment:    comment,
		CreatedAt:  time.Now(),
	}

	if err := s.repo.Create(review); err != nil {
		return nil, err
	}
	return review, nil
}

func (s *ReviewService) Update(reviewID, reviewerID string, rate int, comment string) (*models.Review, error) {
	review, err := s.repo.GetByID(reviewID)
	if err != nil {
		return nil, err
	}
	if review.ReviewerID != reviewerID {
		return nil, errors.New("unauthorized")
	}

	if rate >= 1 && rate <= 5 {
		review.Rate = rate
	}
	if comment != "" {
		review.Comment = comment
	}

	if err := s.repo.Update(review); err != nil {
		return nil, err
	}
	return review, nil
}

func (s *ReviewService) GetReviewsOfUser(userID string) ([]UserReview, error) {

	userProfile, _ := s.repo.GetUserById(userID)

	reviews, err := s.repo.GetAllReviewsUser(userProfile.UserID)
	if err != nil {
		return []UserReview{}, nil
	}

	var userReview []UserReview
	for _, review := range reviews {
		userProfile, err := s.repo.GetUserById(review.ReviewerID)
		if err != nil {
			return []UserReview{}, nil
		}
		ur := UserReview{
			Reviewer:      userProfile.FirstName + " " + userProfile.LastName,
			ReviewerImage: userProfile.ImageURL,
			Rate:          review.Rate,
			Comment:       review.Comment,
			CreateAt:      review.CreatedAt.Format("02-01-2006"),
		}

		userReview = append(userReview, ur)
	}

	return userReview, nil
}

func (s *ReviewService) GetUserRating(userID string) (float64, error) {
	return s.repo.GetAverageRating(userID)
}

type UserReview struct {
	Reviewer      string `json:"reviewer"`
	ReviewerImage string `json:"reviewer_image"`
	Rate          int    `json:"rate"`
	Comment       string `json:"comment"`
	CreateAt      string `json:"created_at"`
}
