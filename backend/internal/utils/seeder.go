package utils

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"log"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedAdminUser(userRepo repositories.UserRepository) {
	const defaultAdminEmail = "info@jobtracker.com"
	const defaultAdminPassword = "password"

	admin, err := userRepo.FindByEmail(defaultAdminEmail)
	if err == nil && admin != nil && admin.Role == "admin" {
		log.Println("[Seeder] Admin user already exists.")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultAdminPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("[Seeder] Failed to hash admin password: %v", err)
	}

	adminUser := &models.User{
		ID:           uuid.NewString(),
		Email:        defaultAdminEmail,
		PasswordHash: string(hashedPassword),
		Role:         "admin",
		Status:       "active",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
		DeletedAt:    gorm.DeletedAt{},
	}

	if err := userRepo.Create(adminUser); err != nil {
		log.Fatalf("[Seeder] Failed to seed admin user: %v", err)
	}

	log.Println("[Seeder] Admin user seeded successfully.")
}
