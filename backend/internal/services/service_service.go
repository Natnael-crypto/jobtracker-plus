package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"fmt"

	"github.com/google/uuid"
)

type ServiceService struct {
	repo     repositories.ServiceRepository
	userRepo repositories.UserRepository
}

func NewServiceService(repo repositories.ServiceRepository, userRepo repositories.UserRepository) *ServiceService {
	return &ServiceService{repo: repo, userRepo: userRepo}
}

func (s *ServiceService) CreateService(userID, serviceName string) (*models.Service, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can create services")
	}

	services, err := s.repo.GetByUserID(userID)

	if err == nil && len(services) >= 3 {
		return nil, errors.New("maximum of 3 services allowed")
	}

	service := &models.Service{
		ID:          uuid.NewString(),
		UserID:      userID,
		ServiceName: serviceName,
	}

	if err := s.repo.Create(service); err != nil {
		return nil, err
	}
	return service, nil
}

func (s *ServiceService) DeleteService(userID, serviceID string) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return errors.New("only business users can delete services")
	}
	return s.repo.Delete(serviceID, userID)
}

func (s *ServiceService) GetServices(userID string) ([]models.Service, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users have services")
	}
	return s.repo.GetByUserID(userID)
}
