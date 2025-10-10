package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"fmt"

	"github.com/google/uuid"
)

type QualificationService struct {
	repo     repositories.QualificationRepository
	userRepo repositories.UserRepository
}

func NewQualificationService(repo repositories.QualificationRepository, userRepo repositories.UserRepository) *QualificationService {
	return &QualificationService{repo: repo, userRepo: userRepo}
}

func (s *QualificationService) CreateQualification(userID, title, institute, description, types string, startYear, endYear int) (*models.Qualification, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can add qualifications")
	}

	qualification := &models.Qualification{
		ID:          uuid.NewString(),
		Title:       title,
		Institute:   institute,
		Description: description,
		StartYear:   startYear,
		EndYear:     endYear,
		UserID:      userID,
		Type:        types,
	}

	if err := s.repo.Create(qualification); err != nil {
		return nil, err
	}
	return qualification, nil
}

func (s *QualificationService) UpdateQualification(userID, qualificationID, title, institute, description string, startYear, endYear int) (*models.Qualification, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users can update qualifications")
	}

	qualification, err := s.repo.GetByID(qualificationID)
	if err != nil {
		return nil, errors.New("qualification not found")
	}

	if title != "" {
		qualification.Title = title
	}
	if institute != "" {
		qualification.Institute = institute
	}
	if description != "" {
		qualification.Description = description
	}

	if startYear != 0 {
		qualification.StartYear = startYear
	}
	if endYear != 0 {
		qualification.EndYear = endYear
	}

	if err := s.repo.Update(&qualification); err != nil {
		return nil, err
	}
	return &qualification, nil
}

func (s *QualificationService) DeleteQualification(userID, qualificationID string) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return errors.New("only business users can delete qualifications")
	}

	return s.repo.Delete(qualificationID, userID)
}

func (s *QualificationService) GetQualifications(userID string) ([]models.Qualification, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	if user.Role != "business" {
		return nil, errors.New("only business users have qualifications")
	}

	return s.repo.GetByUserID(userID)
}
