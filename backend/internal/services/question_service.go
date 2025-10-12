package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

var (
	ErrNotFound     = errors.New("not found")
	ErrUnauthorized = errors.New("unauthorized")
	ErrInvalidInput = errors.New("invalid input")
)

type QuestionService interface {
	CreateQuestion(ctx context.Context, userID string, title, content, category string) (*models.Question, error)
	UpdateQuestion(ctx context.Context, userID string, id, title, content, category string) (*models.Question, error)
	DeleteQuestion(ctx context.Context, userID, id string) error
	GetQuestionByID(ctx context.Context, id string) (*models.Question, error)
	ListQuestions(ctx context.Context, search, category, sort string, offset, limit int, my bool, userID string) ([]models.Question, int64, error)
}

type questionService struct {
	qRepo repositories.QuestionRepository
}

func NewQuestionService(qRepo repositories.QuestionRepository) QuestionService {
	return &questionService{qRepo: qRepo}
}

func (s *questionService) CreateQuestion(ctx context.Context, userID string, title, content, category string) (*models.Question, error) {

	if title == "" || category == "" {
		return nil, ErrInvalidInput
	}

	user, err := s.qRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	q := &models.Question{
		ID:        uuid.New().String(),
		UserID:    userID,
		Title:     title,
		Content:   content,
		Category:  category,
		CreatedAt: time.Now().UTC(),
		FirstName: user.FirstName,
	}
	if err := s.qRepo.Create(ctx, q); err != nil {
		return nil, err
	}
	return q, nil
}

func (s *questionService) UpdateQuestion(ctx context.Context, userID string, id, title, content, category string) (*models.Question, error) {
	existing, err := s.qRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrNotFound
	}
	if existing.UserID != userID {
		return nil, ErrUnauthorized
	}
	existing.Title = title
	existing.Content = content
	existing.Category = category

	if err := s.qRepo.Update(ctx, existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *questionService) DeleteQuestion(ctx context.Context, userID, id string) error {
	existing, err := s.qRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrNotFound
	}
	if existing.UserID != userID {
		return ErrUnauthorized
	}
	return s.qRepo.Delete(ctx, id)
}

func (s *questionService) GetQuestionByID(ctx context.Context, id string) (*models.Question, error) {
	q, err := s.qRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if q == nil {
		return nil, ErrNotFound
	}
	return q, nil
}

func (s *questionService) ListQuestions(ctx context.Context, search, category, sort string, offset, limit int, my bool, userID string) ([]models.Question, int64, error) {
	opts := repositories.ListQuestionsOptions{
		Search:   search,
		Category: category,
		Offset:   offset,
		Limit:    limit,
		Sort:     sort,
		My:       my,
		UserID:   userID,
	}
	return s.qRepo.List(ctx, opts)
}
