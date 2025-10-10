package repositories

import (
	"backend/internal/models"
	"math"

	"gorm.io/gorm"
)

type JobRepository interface {
	Create(job *models.Job) error
	Update(job *models.Job) error
	Delete(id string, userID string) error
	GetByID(id string) (*models.Job, error)
	GetAll() ([]models.Job, error)
	GetMyAllJobs(userID string, page, limit int) ([]models.Job, int64, error)
	GetMyJobStat(userID string) (int, int, error)
	GetJobsInRange(userID string, page, limit int) ([]models.Job, int64, error)
	GetClientDetailJob(jobID string) (string, string, error)
}

type jobRepository struct {
	db *gorm.DB
}

func NewJobRepository(db *gorm.DB) JobRepository {
	return &jobRepository{db: db}
}

func (r *jobRepository) Create(job *models.Job) error {
	return r.db.Create(job).Error
}

func (r *jobRepository) Update(job *models.Job) error {
	return r.db.Save(job).Error
}

func (r *jobRepository) Delete(id string, userID string) error {
	return r.db.Unscoped().Where("id = ? AND user_id = ?", id, userID).Delete(&models.Job{}).Error
}

func (r *jobRepository) GetByID(id string) (*models.Job, error) {
	var job models.Job
	if err := r.db.First(&job, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &job, nil
}

func (r *jobRepository) GetAll() ([]models.Job, error) {
	var jobs []models.Job
	if err := r.db.Find(&jobs).Error; err != nil {
		return nil, err
	}
	return jobs, nil

}

func (r *jobRepository) GetMyAllJobs(userID string, page, limit int) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	// Count total jobs
	if err := r.db.Model(&models.Job{}).
		Where("user_id = ?", userID).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := r.db.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *jobRepository) GetMyJobStat(userID string) (int, int, error) {
	var totalJobs int64
	var hired int64
	if err := r.db.Model(&models.Job{}).Where("user_id = ?", userID).Count(&totalJobs).Error; err != nil {
		return 0, 0, err
	}
	if err := r.db.Model(&models.Job{}).Where("user_id = ? AND status In ('closed','awarded')", userID).Count(&hired).Error; err != nil {
		return 0, 0, err
	}
	return int(totalJobs), int(hired), nil

}

func (r *jobRepository) GetJobsInRange(userID string, page, limit int) ([]models.Job, int64, error) {
	var businessRange models.BusinessRange
	if err := r.db.Where("user_id = ?", userID).First(&businessRange).Error; err != nil {
		return []models.Job{}, 0, nil
	}

	var userAddress models.UserAddress
	if err := r.db.Where("user_id = ?", userID).First(&userAddress).Error; err != nil {
		return []models.Job{}, 0, nil
	}

	radiusKm := float64(businessRange.RangeKm)
	lat, lon := userAddress.Latitude, userAddress.Longitude
	latRadius := radiusKm / 111.0
	lonRadius := radiusKm / (111.0 * math.Cos(lat*math.Pi/180))

	minLat := lat - latRadius
	maxLat := lat + latRadius
	minLon := lon - lonRadius
	maxLon := lon + lonRadius

	// --- count total jobs first ---
	var total int64
	err := r.db.Table("jobs").
		Joins("JOIN job_addresses ja ON ja.job_id = jobs.id").
		Where("jobs.status = ?", "open").
		Where("ja.latitude BETWEEN ? AND ?", minLat, maxLat).
		Where("ja.longitude BETWEEN ? AND ?", minLon, maxLon).
		Count(&total).Error
	if err != nil {
		return []models.Job{}, 0, nil
	}

	// --- fetch jobs with pagination ---
	var jobs []models.Job
	offset := (page - 1) * limit

	err = r.db.Table("jobs").
		Select("jobs.*").
		Joins("JOIN job_addresses ja ON ja.job_id = jobs.id").
		Where("jobs.status = ?", "open").
		Where("ja.latitude BETWEEN ? AND ?", minLat, maxLat).
		Where("ja.longitude BETWEEN ? AND ?", minLon, maxLon).
		Limit(limit).
		Offset(offset).
		Scan(&jobs).Error
	if err != nil {
		return []models.Job{}, 0, nil
	}

	// --- filter by exact distance ---
	filteredJobs := make([]models.Job, 0, len(jobs))
	for _, job := range jobs {
		var addr models.JobAddress
		if err := r.db.Where("job_id = ?", job.ID).First(&addr).Error; err != nil {
			continue
		}
		distance := haversine(lat, lon, addr.Latitude, addr.Longitude)
		if distance <= radiusKm {
			filteredJobs = append(filteredJobs, job)
		}
	}

	return filteredJobs, total, nil
}

func (r *jobRepository) GetClientDetailJob(jobID string) (string, string, error) {
	var job models.Job
	var user models.User
	var userProfile models.UserProfile

	if err := r.db.Where("id = ?", jobID).First(&job).Error; err != nil {
		return "", "", err
	}
	if err := r.db.Where("id = ?", job.UserID).First(&user).Error; err != nil {
		return "", "", err
	}
	if err := r.db.Where("user_id = ?", job.UserID).First(&userProfile).Error; err != nil {
	}

	return user.Email, userProfile.Phone, nil

}

func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371
	dLat := (lat2 - lat1) * math.Pi / 180.0
	dLon := (lon2 - lon1) * math.Pi / 180.0

	lat1 = lat1 * math.Pi / 180.0
	lat2 = lat2 * math.Pi / 180.0

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Sin(dLon/2)*math.Sin(dLon/2)*math.Cos(lat1)*math.Cos(lat2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}
