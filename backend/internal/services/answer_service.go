package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

type AnswerService interface {
	CreateAnswer(ctx context.Context, userID, questionID, content string) (*models.Answer, error)
	UpdateAnswer(ctx context.Context, userID, id, content string) (*models.Answer, error)
	DeleteAnswer(ctx context.Context, userID, id string) error
	ListAnswersForQuestion(ctx context.Context, questionID string, offset, limit int, sort string) ([]models.Answer, int64, error)
	LikeAnswer(ctx context.Context, userID, answerID string) error
	UnlikeAnswer(ctx context.Context, userID, answerID string) error
	GetAnswerByID(ctx context.Context, id string) (*models.Answer, error)
	HasRecordedVote(ctx context.Context, anno_id, answerID, ip string) (bool, error)
	RecordedVote(ctx context.Context, anno_id, answerID, ip string) error
}

type answerService struct {
	aRepo repositories.AnswerRepository
}

func NewAnswerService(aRepo repositories.AnswerRepository) AnswerService {
	return &answerService{aRepo: aRepo}
}

func (s *answerService) CreateAnswer(ctx context.Context, userID, questionID, content string) (*models.Answer, error) {
	if content == "" {
		return nil, ErrInvalidInput
	}
	user, err := s.aRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	exists, err := s.aRepo.GetAnswerForQuestionUserID(ctx, questionID, userID)
	if err != nil {
		return nil, err
	}
	if exists != nil {
		return nil, errors.New("you have already answered this question")
	}

	a := &models.Answer{
		ID:         uuid.New().String(),
		QuestionID: questionID,
		UserID:     userID,
		Content:    content,
		CreatedAt:  time.Now().UTC(),
		FullName:   user.FirstName + " " + user.LastName,
		ImageUrl:   user.ImageURL,
	}

	if err := s.aRepo.Create(ctx, a); err != nil {
		return nil, err
	}

	if err := s.aRepo.UpdateCount(ctx, questionID); err != nil {
		return nil, err
	}

	return a, nil
}

func (s *answerService) UpdateAnswer(ctx context.Context, userID, id, content string) (*models.Answer, error) {
	existing, err := s.aRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrNotFound
	}
	if existing.UserID != userID {
		return nil, ErrUnauthorized
	}
	existing.Content = content
	existing.UpdatedAt = time.Now().UTC()
	if err := s.aRepo.Update(ctx, existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *answerService) DeleteAnswer(ctx context.Context, userID, id string) error {
	existing, err := s.aRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrNotFound
	}
	if existing.UserID != userID {
		return ErrUnauthorized
	}
	if err := s.aRepo.DecrementCount(ctx, existing.QuestionID); err != nil {
		return err
	}
	return s.aRepo.Delete(ctx, id)
}

func (s *answerService) ListAnswersForQuestion(ctx context.Context, questionID string, offset, limit int, sort string) ([]models.Answer, int64, error) {
	return s.aRepo.ListByQuestion(ctx, questionID, offset, limit, sort)
}

func (s *answerService) LikeAnswer(ctx context.Context, userID, answerID string) error {
	return s.aRepo.IncrementLike(ctx, answerID)
}

func (s *answerService) UnlikeAnswer(ctx context.Context, userID, answerID string) error {
	return s.aRepo.DecrementLike(ctx, answerID)
}

func (s *answerService) GetAnswerByID(ctx context.Context, id string) (*models.Answer, error) {
	a, err := s.aRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if a == nil {
		return nil, ErrNotFound
	}
	return a, nil
}

func (s *answerService) RecordedVote(ctx context.Context, anno_id, answerID, ip string) error {
	rec := &models.LikeConstraint{
		AnswerID: answerID,
		AnnoID:   anno_id,
		Ip:       ip,
	}
	return s.aRepo.RecordedVote(ctx, rec)
}

func (s *answerService) HasRecordedVote(ctx context.Context, anno_id, answerID, ip string) (bool, error) {
	return s.aRepo.HasRecordedVote(ctx, anno_id, answerID, ip)
}
