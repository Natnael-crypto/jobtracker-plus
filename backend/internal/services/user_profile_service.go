package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"
	"context"
	"fmt"
	"mime/multipart"

	"github.com/google/uuid"
)

const maxFileSize = 2 << 20 // 2 MB

type UserProfileService struct {
	Repo      *repositories.UserProfileRepository
	S3Service *utils.S3Service
}

func NewUserProfileService(repo *repositories.UserProfileRepository, s3Service *utils.S3Service) *UserProfileService {
	return &UserProfileService{
		Repo:      repo,
		S3Service: s3Service,
	}
}

func (s *UserProfileService) GetProfile(userID string) (*models.UserProfile, error) {
	profile, err := s.Repo.GetByUserID(userID)
	if profile == nil && err == nil {
		// create empty profile if not exist
		profile = &models.UserProfile{
			ID:     uuid.NewString(),
			UserID: userID,
		}
		err = s.Repo.Create(profile)
	}
	return profile, err
}

func (s *UserProfileService) CreateProfile(userID, firstName, lastName, phone_number string) (*models.UserProfile, error) {
	_, err := s.Repo.GetByUserID(userID)
	if err == nil {
		return nil, err
	}
	profile := &models.UserProfile{
		ID:        uuid.NewString(),
		UserID:    userID,
		FirstName: firstName,
		LastName:  lastName,
		Phone:     phone_number,
		AddressID: nil,
		ImageURL:  "",
	}
	if err := s.Repo.Create(profile); err != nil {
		return nil, err
	} else {
		return profile, nil
	}
}

func (s *UserProfileService) UpdateProfile(userID string, firstName, lastName, phone string) (*models.UserProfile, error) {
	profile, err := s.GetProfile(userID)
	if err != nil {
		return nil, err
	}

	if firstName != "" {
		profile.FirstName = firstName
	}
	if lastName != "" {
		profile.LastName = lastName
	}
	if phone != "" {
		profile.Phone = phone
	}

	if err := s.Repo.Update(profile); err != nil {
		return nil, err
	}

	return profile, nil
}

func (s *UserProfileService) UploadProfileImage(ctx context.Context, userID string, file multipart.File) (*models.UserProfile, error) {
	buf, contentType, ext, err := utils.ReadAndValidateImage(file, maxFileSize)
	if err != nil {
		return nil, err
	}

	key := fmt.Sprintf("profile-images/%s%s", userID, ext)

	imageURL, err := s.S3Service.UploadProfileImage(ctx, buf, contentType, ext, userID, key)
	if err != nil {
		return nil, err
	}

	profile, err := s.GetProfile(userID)
	if err != nil {
		return nil, err
	}

	profile.ImageURL = imageURL
	if err := s.Repo.Update(profile); err != nil {
		return nil, err
	}

	return profile, nil
}

func (s *UserProfileService) GetUserProfileData(userID string) (*models.UserProfileResponse, error) {
	profile, err := s.Repo.GetUserProfile(userID)
	if err != nil {
		return nil, err
	}
	userID = profile.UserID

	reviews, avg, err := s.Repo.GetReviews(userID)
	if err != nil {
		return nil, err
	}

	services, err := s.Repo.GetServices(userID)
	if err != nil {
		return nil, err
	}

	qualifications, err := s.Repo.GetQualifications(userID)
	if err != nil {
		return nil, err
	}

	education := []models.Qualification{}
	awards := []models.Qualification{}
	for _, q := range qualifications {
		if q.Type == "Education" {
			education = append(education, q)
		} else if q.Type == "Award" {
			awards = append(awards, q)
		}
	}

	portfolio, err := s.Repo.GetPortfolio(userID)
	if err != nil {
		return nil, err
	}

	intro, err := s.Repo.GetBusinessIntroduction(userID)
	if err != nil {
		return nil, err
	}

	return &models.UserProfileResponse{
		UserProfile:          profile,
		Reviews:              reviews,
		AverageRate:          avg,
		Services:             services,
		Qualifications:       qualifications,
		Education:            education,
		Awards:               awards,
		Portfolio:            portfolio,
		BusinessIntroduction: intro,
	}, nil
}
