package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"
	"context"
	"errors"

	"github.com/google/uuid"
)

type UserService struct {
	Repo               *repositories.UserRepository
	JwtSecrete         string
	UserProfileService *UserProfileService
	CreditService      *CreditService
	Notification       *NotificationService
}

func NewUserService(repo *repositories.UserRepository, JwtSecrete string, UserProfileService *UserProfileService, CreditService *CreditService, Notification *NotificationService) *UserService {
	return &UserService{Repo: repo, JwtSecrete: JwtSecrete, UserProfileService: UserProfileService, CreditService: CreditService, Notification: Notification}
}

type UserVerificationStatus struct {
	ID       string `json:"id"`
	Email    bool   `json:"email"`
	Identity bool   `json:"identity"`
}

func (s *UserService) Register(email, password, role, first_name, last_name, phone_number string) (*models.User, error) {
	existing, _ := s.Repo.FindByEmail(email)
	if existing != nil {
		return nil, errors.New("email already exists")
	}

	hash, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		ID:           uuid.NewString(),
		Email:        email,
		PasswordHash: hash,
		Role:         role,
	}
	userVerifyEmail := &models.UserVerification{
		ID:       uuid.NewString(),
		UserID:   user.ID,
		Type:     "email",
		Verified: false,
	}

	userVerifyIdentity := &models.UserVerification{
		ID:       uuid.NewString(),
		UserID:   user.ID,
		Type:     "identity",
		Verified: false,
	}

	if err := s.Repo.CreateVerify(userVerifyEmail); err != nil {
		return nil, err
	}
	if err := s.Repo.CreateVerify(userVerifyIdentity); err != nil {
		return nil, err
	}

	if err := s.Repo.Create(user); err != nil {
		return nil, err
	}

	s.CreditService.CreateCredit(user.ID)

	_, _ = s.UserProfileService.CreateProfile(user.ID, first_name, last_name, phone_number)

	message := "We're excited to have you on board. Start exploring opportunities and manage your jobs seamlessly."

	if user.Role == "business" {
		message = "We're excited to have you on board. Start exploring opportunities and manage your jobs seamlessly."
	}

	s.Notification.Create(context.Background(), user.ID, "Welcome to JobTracker!", message)
	return user, nil
}

func (s *UserService) CheckEmailExists(email string) (bool, error) {
	user, err := s.Repo.FindByEmail(email)
	if err != nil {
		return false, err
	}
	if user != nil {
		return true, nil
	}
	return false, nil
}

func (s *UserService) Login(email, password string) (string, error) {
	user, err := s.Repo.FindByEmail(email)
	if err != nil || user == nil {
		return "", errors.New("invalid credentials")
	}

	if err := utils.CheckPasswordHash(password, user.PasswordHash); err != nil {
		return "", errors.New("invalid credentials")
	}

	if user.Status != "active" {
		return "", errors.New("user is blocked")
	}

	token, err := utils.GenerateJWT(user.ID, user.Role, email, s.JwtSecrete)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *UserService) ChangePassword(userID, oldPassword, newPassword string) error {
	user, err := s.Repo.FindByID(userID)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	if err := utils.CheckPasswordHash(oldPassword, user.PasswordHash); err != nil {
		return errors.New("incorrect password")
	}

	hash, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = hash
	if err := s.Repo.Update(user); err != nil {
		return err
	}
	return nil
}

func (s *UserService) DeleteUser(userID, password string) error {
	user, err := s.Repo.FindByID(userID)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	if err := utils.CheckPasswordHash(password, user.PasswordHash); err != nil {
		return errors.New("incorrect password")
	}

	return s.Repo.Delete(user)
}

func (s *UserService) BlockUser(adminID, targetID string) error {
	admin, err := s.Repo.FindByID(adminID)
	if err != nil || admin == nil || admin.Role != "admin" {
		return errors.New("unauthorized")
	}

	user, err := s.Repo.FindByID(targetID)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	user.Status = "blocked"
	return s.Repo.Update(user)
}

func (s *UserService) UnBlockUser(adminID, targetID string) error {
	admin, err := s.Repo.FindByID(adminID)
	if err != nil || admin == nil || admin.Role != "admin" {
		return errors.New("unauthorized")
	}

	user, err := s.Repo.FindByID(targetID)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	user.Status = "active"
	return s.Repo.Update(user)
}

func (s *UserService) FindByID(userID string) (*models.User, error) {
	return s.Repo.FindByID(userID)
}

func (s *UserService) Verified(userID string) (UserVerificationStatus, error) {
	userEmail, _ := s.Repo.Verified(userID, "email")
	userIdentity, _ := s.Repo.Verified(userID, "identity")

	respo := UserVerificationStatus{
		ID:       userID,
		Email:    userEmail.Verified,
		Identity: userIdentity.Verified,
	}

	return respo, nil
}
