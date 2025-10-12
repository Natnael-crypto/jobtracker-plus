package repositories

import (
	"backend/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type AnswerRepository interface {
	Create(ctx context.Context, a *models.Answer) error
	GetByID(ctx context.Context, id string) (*models.Answer, error)
	Update(ctx context.Context, a *models.Answer) error
	Delete(ctx context.Context, id string) error
	ListByQuestion(ctx context.Context, questionID string, offset, limit int, sort string) ([]models.Answer, int64, error)
	IncrementLike(ctx context.Context, answerID string) error
	DecrementLike(ctx context.Context, answerID string) error
	RecordedVote(ctx context.Context, rec *models.LikeConstraint) error
	HasRecordedVote(ctx context.Context, anno_id, answerID, ip string) (bool, error)
	GetByUserID(ctx context.Context, userID string) (*models.UserProfile, error)
	GetByQuestionID(ctx context.Context, questionID string) (*models.Question, error)
	UpdateCount(ctx context.Context, questionID string) error
	DecrementCount(ctx context.Context, questionID string) error
	GetAnswerForQuestionUserID(ctx context.Context, questionID, userID string) (*models.Answer, error)
}

type answerRepo struct {
	db *gorm.DB
}

func NewAnswerRepo(db *gorm.DB) AnswerRepository {
	return &answerRepo{db: db}
}

func (r *answerRepo) Create(ctx context.Context, a *models.Answer) error {
	return r.db.WithContext(ctx).Create(a).Error
}

func (r *answerRepo) GetByQuestionID(ctx context.Context, questionID string) (*models.Question, error) {
	var answers models.Question
	if err := r.db.WithContext(ctx).Where("question_id = ?", questionID).First(&answers).Error; err != nil {
		return nil, err
	}
	return &answers, nil
}

func (r *answerRepo) GetAnswerForQuestionUserID(ctx context.Context, questionID, userID string) (*models.Answer, error) {
	var answer models.Answer
	if err := r.db.WithContext(ctx).Where("question_id = ? AND user_id = ?", questionID, userID).First(&answer).Error; err != nil {
		return nil, err
	}
	return &answer, nil
}

func (r *answerRepo) UpdateCount(ctx context.Context, questionID string) error {
	return r.db.WithContext(ctx).Model(&models.Question{}).Where("id = ?", questionID).UpdateColumn("answer_count", gorm.Expr("answer_count + ?", 1)).Error
}

func (r *answerRepo) DecrementCount(ctx context.Context, questionID string) error {
	return r.db.WithContext(ctx).Model(&models.Question{}).Where("id = ? AND answer_count > 0", questionID).UpdateColumn("answer_count", gorm.Expr("answer_count - ?", 1)).Error
}

func (r *answerRepo) GetByUserID(ctx context.Context, userID string) (*models.UserProfile, error) {
	var user models.UserProfile
	if err := r.db.WithContext(ctx).First(&user, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *answerRepo) GetByID(ctx context.Context, id string) (*models.Answer, error) {
	var a models.Answer
	if err := r.db.WithContext(ctx).First(&a, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (r *answerRepo) Update(ctx context.Context, a *models.Answer) error {
	return r.db.WithContext(ctx).Model(&models.Answer{}).Where("id = ?", a.ID).Updates(map[string]interface{}{
		"content":    a.Content,
		"updated_at": a.UpdatedAt,
	}).Error
}

func (r *answerRepo) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&models.Answer{}, "id = ?", id).Error
}

func (r *answerRepo) ListByQuestion(
	ctx context.Context,
	questionID string,
	offset, limit int,
	sort string,
) ([]models.Answer, int64, error) {
	var list []models.Answer
	var total int64

	q := r.db.WithContext(ctx).Model(&models.Answer{}).Where("question_id = ?", questionID)

	// Count total results
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	sortOrder := "created_at DESC" // default

	switch sort {
	case "Newest":
		sortOrder = "created_at DESC"
	case "Oldest":
		sortOrder = "created_at ASC"
	case "Most liked", "MostLiked", "likes", "upvotes":
		sortOrder = "like_count DESC"
	case "-upvotes":
		sortOrder = "like_count DESC"
	}

	// Pagination defaults
	if limit == 0 {
		limit = 20
	}

	// ✅ Execute safely with parameterized query
	if err := q.Order(sortOrder).Offset(offset).Limit(limit).Find(&list).Error; err != nil {
		return []models.Answer{}, 0, nil // Return empty list instead of nil
	}

	return list, total, nil
}

func (r *answerRepo) IncrementLike(ctx context.Context, answerID string) error {
	return r.db.WithContext(ctx).Model(&models.Answer{}).Where("id = ?", answerID).UpdateColumn("like_count", gorm.Expr("like_count + ?", 1)).Error
}

func (r *answerRepo) DecrementLike(ctx context.Context, answerID string) error {
	return r.db.WithContext(ctx).Model(&models.Answer{}).Where("id = ? AND like_count > 0", answerID).UpdateColumn("like_count", gorm.Expr("like_count - ?", 1)).Error
}

func (r *answerRepo) RecordedVote(ctx context.Context, rec *models.LikeConstraint) error {
	return r.db.WithContext(ctx).Create(&rec).Error
}

func (r *answerRepo) HasRecordedVote(ctx context.Context, anno_id, answerID, ip string) (bool, error) {
	var count int64
	if err := r.db.WithContext(ctx).Model(&models.LikeConstraint{}).Where("anno_id = ? AND answer_id = ? AND ip = ?", anno_id, answerID, ip).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
