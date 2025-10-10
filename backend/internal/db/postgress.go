package db

import (
	"backend/config"
	"backend/internal/models"
	"context"
	"fmt"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPostgresDB(cfg *config.DatabaseConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Shanghai",
		cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Postgres: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	pingCtx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(pingCtx); err != nil {
		sqlDB.Close()
		return nil, fmt.Errorf("failed to ping Postgres: %w", err)
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.UserProfile{},
		&models.UserToken{},
		&models.UserAddress{},
		&models.UserVerification{},
		&models.BusinessRange{},
		&models.Service{},
		&models.Qualification{},
		&models.Portfolio{},
		&models.BusinessIntroduction{},
		&models.Credit{},
		&models.CreditHistory{},
		&models.CreditPurchase{},
		&models.JobBid{},
		&models.JobInvitation{},
		&models.Job{},
		&models.JobAddress{},
		&models.JobImage{},
		&models.Event{},
		&models.Message{},
		&models.Review{},
		&models.Notification{},
		&models.Quotation{},
		&models.Invoice{},
		&models.LineItem{},
	); err != nil {
		return nil, fmt.Errorf("auto migration failed: %w", err)
	}

	fmt.Println("PostgreSQL connected and auto-migration successful")
	return db, nil
}

func CloseDB(db *gorm.DB) {
	if db == nil {
		return
	}
	sqlDB, err := db.DB()
	if err != nil {
		fmt.Println("⚠️ Failed to get sql.DB for closing:", err)
		return
	}
	if err := sqlDB.Close(); err != nil {
		fmt.Println("⚠️ Failed to close PostgreSQL connection:", err)
	} else {
		fmt.Println("✅ PostgreSQL connection pool closed")
	}
}
