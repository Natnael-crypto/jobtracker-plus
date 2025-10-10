package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"crypto/rand"
	"encoding/base32"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserTokenService struct {
	repo     repositories.UserTokenRepository
	userRepo repositories.UserRepository
}

func NewUserTokenService(repo repositories.UserTokenRepository, userRepo repositories.UserRepository) *UserTokenService {
	return &UserTokenService{repo: repo, userRepo: userRepo}
}

// --- Helpers ---
func generateRandomString(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(bytes)[:length], nil
}

func (s *UserTokenService) GenerateEmailVerification(userID string) (string, error) {
	code, err := generateRandomString(12)
	if err != nil {
		return "", err
	}

	token := &models.UserToken{
		ID:        uuid.NewString(),
		UserID:    userID,
		Type:      "email",
		Token:     code,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}

	_ = s.repo.DeleteByIDUnscoped(token.ID, "email")
	if err := s.repo.Create(token); err != nil {
		return "", err
	}
	return code, nil
}

func (s *UserTokenService) VerifyEmail(code string) error {
	token, err := s.repo.GetByUserAndType(code, "email")
	if err != nil {
		return errors.New("invalid or expired code")
	}

	if time.Now().After(token.ExpiresAt) {
		_ = s.repo.DeleteByIDUnscoped(token.ID, "email")
		_, _ = s.GenerateEmailVerification(token.UserID)
		return errors.New("code expired, new one sent")
	}

	if token.Token != code {
		token.Trail++
		if token.Trail >= 3 {
			_ = s.repo.DeleteByIDUnscoped(token.ID, "email")
			_, _ = s.GenerateEmailVerification(token.UserID)
			return errors.New("too many failed attempts, new code sent")
		}
		_ = s.repo.Update(token)
		return errors.New("invalid code")
	}

	user, err := s.repo.FindVerificationByUserID(token.UserID, "email")
	if err != nil {
		return err
	}
	user.Verified = true

	err = s.userRepo.UpdateVerify(user)
	if err != nil {
		return errors.New("unable to update Status")
	}

	_ = s.repo.DeleteByIDUnscoped(token.ID, "email")
	return nil
}

func (s *UserTokenService) GeneratePasswordReset(email string) (string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", err
	}
	code, err := generateRandomString(6)
	if err != nil {
		return "", err
	}

	token := &models.UserToken{
		ID:        uuid.NewString(),
		UserID:    user.ID,
		Type:      "password",
		Token:     code,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}

	_ = s.repo.DeleteByIDUnscoped(token.ID, "password")
	if err := s.repo.Create(token); err != nil {
		return "", err
	}
	return code, nil
}

func (s *UserTokenService) ResetPassword(email, code, newPassword string) error {
	token, err := s.repo.GetByUserAndType(code, "password")
	if err != nil {
		return errors.New("invalid or expired code")
	}

	if time.Now().After(token.ExpiresAt) {
		_ = s.repo.DeleteByIDUnscoped(token.ID, "password")
		_, _ = s.GeneratePasswordReset(email)
		return errors.New("code expired, new one sent")
	}

	if token.Token != code {
		token.Trail++
		if token.Trail >= 3 {
			_ = s.repo.DeleteByIDUnscoped(token.ID, "password")
			_, _ = s.GeneratePasswordReset(email)
			return errors.New("too many failed attempts, new code sent")
		}
		_ = s.repo.Update(token)
		return errors.New("invalid code")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hashed)

	if err := s.userRepo.Update(user); err != nil {
		return err
	}

	_ = s.repo.DeleteByIDUnscoped(token.ID, "password")
	return nil
}
