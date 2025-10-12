package repositories

import (
	"backend/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type QuestionRepository interface {
	Create(ctx context.Context, q *models.Question) error
	GetByID(ctx context.Context, id string) (*models.Question, error)
	Update(ctx context.Context, q *models.Question) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, opts ListQuestionsOptions) ([]models.Question, int64, error)
	GetByUserID(ctx context.Context, userID string) (*models.UserProfile, error)
}

type ListQuestionsOptions struct {
	Search   string
	Category string
	Offset   int
	Limit    int
	Sort     string
	My       bool
	UserID   string
}

type questionRepo struct {
	db *gorm.DB
}

func NewQuestionRepo(db *gorm.DB) QuestionRepository {
	return &questionRepo{db: db}
}

func (r *questionRepo) Create(ctx context.Context, q *models.Question) error {
	return r.db.WithContext(ctx).Create(q).Error
}

func (r *questionRepo) GetByUserID(ctx context.Context, userID string) (*models.UserProfile, error) {
	var user models.UserProfile
	if err := r.db.WithContext(ctx).First(&user, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *questionRepo) GetByID(ctx context.Context, id string) (*models.Question, error) {
	var q models.Question
	if err := r.db.WithContext(ctx).First(&q, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &q, nil
}

func (r *questionRepo) Update(ctx context.Context, q *models.Question) error {
	return r.db.WithContext(ctx).Model(&models.Question{}).Where("id = ?", q.ID).Updates(map[string]interface{}{
		"title":    q.Title,
		"content":  q.Content,
		"category": q.Category,
	}).Error
}

func (r *questionRepo) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&models.Question{}, "id = ?", id).Error
}

func (r *questionRepo) List(ctx context.Context, opts ListQuestionsOptions) ([]models.Question, int64, error) {
	var items []models.Question
	var total int64

	q := r.db.WithContext(ctx).Model(&models.Question{})

	// Filter by owner
	if opts.My {
		q = q.Where("user_id = ?", opts.UserID)
	}

	// Search by title or content
	if opts.Search != "" {
		like := "%" + opts.Search + "%"
		q = q.Where("title ILIKE ? OR content ILIKE ?", like, like)
	}

	// Filter by category
	if opts.Category != "" {
		q = q.Where("category = ?", opts.Category)
	}

	// Count total records before pagination
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Sorting logic
	var sortOrder string
	switch opts.Sort {
	case "Newest":
		sortOrder = "created_at DESC"
	case "Oldest":
		sortOrder = "created_at ASC"
	case "Answered":
		sortOrder = "answer_count DESC"
	case "All", "":
		sortOrder = "created_at DESC"
	default:
		sortOrder = "created_at DESC"
	}

	// Pagination defaults
	if opts.Limit == 0 {
		opts.Limit = 20
	}

	// Fetch paginated results
	if err := q.Order(sortOrder).Offset(opts.Offset).Limit(opts.Limit).Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}
