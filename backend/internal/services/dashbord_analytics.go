package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
)

type DashBoardAnalytics struct {
	repo *repositories.DashBoardRepository
}

func NewDashBoardAnalytics(repo *repositories.DashBoardRepository) *DashBoardAnalytics {
	return &DashBoardAnalytics{repo: repo}
}

func (s *DashBoardAnalytics) GetBusinessDashboard(userID string) (*repositories.BusinessDashBoard, error) {
	return s.repo.GetBusinessDashboard(userID)
}

func (s *DashBoardAnalytics) GetProfileView(userID string, lastDay int) ([]models.ProfileView, error) {
	return s.repo.GetProfileView(userID, lastDay)
}

func (s *DashBoardAnalytics) AddProfileView(userID string) error {
	err := s.repo.CreateProfileView(userID)
	if err != nil {
		return err
	}
	return nil
}

func (s *DashBoardAnalytics) GetClientDashboard(userID string) (repositories.ClientDashBoard, error) {
	return s.repo.GetClientDashboardData(userID)
}
