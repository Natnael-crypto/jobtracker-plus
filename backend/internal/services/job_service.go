package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"fmt"
	"time"
)

type JobService struct {
	repo repositories.JobRepository
}

func NewJobService(repo repositories.JobRepository) *JobService {
	return &JobService{repo: repo}
}

// Create job
func (s *JobService) Create(userID, role, id, category, specific, description, headline, t, budget string) (*models.Job, error) {
	if category == "" {
		return nil, errors.New("service category is required")
	}

	if role != "client" {
		return nil, errors.New("only clients can create jobs")
	}

	job := &models.Job{
		ID:              id,
		UserID:          userID,
		ServiceCategory: category,
		ServiceSpecific: specific,
		Time:            t,
		Budget:          budget,
		Description:     description,
		Headline:        headline,
		Status:          "open",
		CreatedAt:       time.Now(),
	}

	if err := s.repo.Create(job); err != nil {
		return nil, fmt.Errorf("failed to create job: %w", err)
	}
	return job, nil
}

func (s *JobService) Update(jobID, userID string, category, specific, description, headline, t, budget string) (*models.Job, error) {
	job, err := s.repo.GetByID(jobID)
	if err != nil {
		return nil, fmt.Errorf("job not found: %w", err)
	}
	if job.UserID != userID {
		return nil, errors.New("not authorized to update this job")
	}
	if category != "" {
		job.ServiceCategory = category
	}
	if specific != "" {
		job.ServiceSpecific = specific
	}
	if t != "" {
		job.Time = t
	}
	if budget != "" {
		job.Budget = budget
	}
	if description != "" {
		job.Description = description
	}
	if headline != "" {
		job.Headline = headline
	}

	if err := s.repo.Update(job); err != nil {
		return nil, fmt.Errorf("failed to update job: %w", err)
	}
	return job, nil
}

// Update status
func (s *JobService) UpdateStatus(jobID, userID, status string) (*models.Job, error) {
	if status != "open" && status != "closed" && status != "awarded" {
		return nil, errors.New("invalid status value")
	}

	job, err := s.repo.GetByID(jobID)
	if err != nil {
		return nil, fmt.Errorf("job not found: %w", err)
	}
	if job.UserID != userID {
		return nil, errors.New("not authorized to update status")
	}

	job.Status = status
	if err := s.repo.Update(job); err != nil {
		return nil, fmt.Errorf("failed to update status: %w", err)
	}
	return job, nil
}

// Delete job
func (s *JobService) Delete(jobID, userID string) error {
	return s.repo.Delete(jobID, userID)
}

// Get job by ID
func (s *JobService) GetByID(jobID string) (*models.Job, error) {
	return s.repo.GetByID(jobID)
}

func (s *JobService) GetAll() ([]models.Job, error) {
	return s.repo.GetAll()
}

func (s *JobService) GetMyAllJobs(userID string, page, limit int) ([]models.Job, int64, error) {
	return s.repo.GetMyAllJobs(userID, page, limit)
}

func (s *JobService) GetMyJobStat(userID string) (int, int, error) {
	return s.repo.GetMyJobStat(userID)
}

func (s *JobService) GetJobForBusinessUser(userID string, page, limit int) ([]models.Job, int64, error) {
	return s.repo.GetJobsInRange(userID, page, limit)
}

func (s *JobService) GetClientDetailJob(jobID string) (string, string, error) {
	return s.repo.GetClientDetailJob(jobID)
}
