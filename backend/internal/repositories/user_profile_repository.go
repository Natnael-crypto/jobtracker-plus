package repositories

import (
	"backend/internal/models"
	"errors"

	"gorm.io/gorm"
)

type UserProfileRepository struct {
	DB *gorm.DB
}

func NewUserProfileRepository(db *gorm.DB) *UserProfileRepository {
	return &UserProfileRepository{DB: db}
}

func (r *UserProfileRepository) GetByUserID(userID string) (*models.UserProfile, error) {
	var profile models.UserProfile
	err := r.DB.Where("user_id = ?", userID).First(&profile).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &profile, err
}

func (r *UserProfileRepository) Create(profile *models.UserProfile) error {
	return r.DB.Create(profile).Error
}

func (r *UserProfileRepository) Update(profile *models.UserProfile) error {
	return r.DB.Save(profile).Error
}

func (r *UserProfileRepository) GetUserProfile(userID string) (*models.UserProfile, error) {
	var profile models.UserProfile
	if err := r.DB.Where("id = ?", userID).First(&profile).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, nil
	}
	return &profile, nil
}

func (r *UserProfileRepository) GetReviews(userID string) ([]models.Review, float64, error) {
	var reviews []models.Review
	if err := r.DB.Where("reviewer_id = ?", userID).Find(&reviews).Error; err != nil {
		return []models.Review{}, 0, nil
	}

	if len(reviews) == 0 {
		return reviews, 0, nil
	}

	total := 0
	for _, r := range reviews {
		total += r.Rate
	}
	avg := float64(total) / float64(len(reviews))
	return reviews, avg, nil
}

func (r *UserProfileRepository) GetServices(userID string) ([]models.Service, error) {
	var services []models.Service
	if err := r.DB.Where("user_id = ?", userID).Find(&services).Error; err != nil {
		return []models.Service{}, nil
	}
	return services, nil
}

func (r *UserProfileRepository) GetQualifications(userID string) ([]models.Qualification, error) {
	var qualifications []models.Qualification
	if err := r.DB.Where("user_id = ?", userID).Find(&qualifications).Error; err != nil {
		return []models.Qualification{}, nil
	}
	return qualifications, nil
}

func (r *UserProfileRepository) GetPortfolio(userID string) ([]models.Portfolio, error) {
	var portfolio []models.Portfolio
	if err := r.DB.Where("user_id = ?", userID).Find(&portfolio).Error; err != nil {
		return []models.Portfolio{}, nil
	}
	return portfolio, nil
}

func (r *UserProfileRepository) GetBusinessIntroduction(userID string) (*models.BusinessIntroduction, error) {
	var intro models.BusinessIntroduction
	if err := r.DB.Where("user_id = ?", userID).First(&intro).Error; err != nil {
		intro.Description = ""
		intro.UserID = userID
		return &intro, nil
	}
	return &intro, nil
}

type ProfileStatsResponse struct {
	Identity       bool
	Email          bool
	ProfileImage   bool
	Address        bool
	AboutMe        bool
	Services       bool
	Qualifications bool
	Portfolio      bool
}

func (r *UserProfileRepository) ProfileStatus(userID string) (*ProfileStatsResponse, error) {
	var profileStat ProfileStatsResponse
	var profile *models.UserProfile
	var address models.UserAddress
	var aboutMe models.BusinessIntroduction
	var services []models.Service
	var qualifications []models.Qualification
	var portfolio []models.Portfolio
	var Identity models.UserVerification
	var Email models.UserVerification

	profile, err := r.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	if profile.ImageURL != "" {
		profileStat.ProfileImage = true
	}

	if err := r.DB.Where("user_id = ? AND type = 'identity'", userID).First(&Identity).Error; err != nil {
		profileStat.Identity = false
	} else {
		if !Identity.Verified {
			profileStat.Identity = false
		}
		profileStat.Identity = true
	}

	if err := r.DB.Where("user_id = ? AND type = 'email'", userID).First(&Email).Error; err != nil {
		profileStat.Email = false
	} else {
		if !Email.Verified {
			profileStat.Email = false
		}
		profileStat.Email = true
	}

	if err := r.DB.Where("user_id = ?", userID).First(&address).Error; err != nil {
		profileStat.Address = false
	} else {
		profileStat.Address = true
	}
	if err := r.DB.Where("user_id = ?", userID).First(&aboutMe).Error; err != nil {
		profileStat.AboutMe = false
	} else {
		profileStat.AboutMe = true
	}
	if err := r.DB.Where("user_id = ?", userID).Find(&services).Error; err != nil {
		profileStat.Services = false
	} else {
		if len(services) == 0 {
			profileStat.Services = false
		} else {
			profileStat.Services = true

		}
	}
	if err := r.DB.Where("user_id = ?", userID).Find(&qualifications).Error; err != nil {
		profileStat.Qualifications = false
	} else {
		if len(qualifications) == 0 {
			profileStat.Qualifications = false
		} else {
			profileStat.Qualifications = true
		}
	}
	if err := r.DB.Where("user_id = ?", userID).Find(&portfolio).Error; err != nil {
		profileStat.Portfolio = false
	} else {
		if len(portfolio) == 0 {
			profileStat.Portfolio = false
		} else {
			profileStat.Portfolio = true
		}
	}

	return &profileStat, nil
}
