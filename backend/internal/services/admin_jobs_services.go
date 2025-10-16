package services

import "backend/internal/repositories"

type AdminJobServices struct {
	repo *repositories.AdminJobRepository
}

func NewAdminJobServices(repo *repositories.AdminJobRepository) *AdminJobServices {
	return &AdminJobServices{repo: repo}
}

func (s *AdminJobServices) GetJobs(limit, offset int, search, status string) ([]repositories.JobDetail, int64, error) {
	return s.repo.GetJobs(limit, offset, search, status)
}
