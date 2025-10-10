package config

import (
	"fmt"
	"log"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	JWT      JWTConfig
	Google   GoogleConfig
	Session  SessionConfig
	AWS      AWSConfig
	BaseUrl  BaseUrls
	Stripe   Stripe
	Email    SMTPConfig
	Geocode  GeocodeConfig
}

type GeocodeConfig struct {
	APIKey string
}

type AWSConfig struct {
	AccessKeyID     string
	SecretAccessKey string
	Region          string
	Bucket          string
}

type GoogleConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
}

type ServerConfig struct {
	Port         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	Debug        bool
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type RedisConfig struct {
	URL string
}

type SessionConfig struct {
	KEY string
}

type JWTConfig struct {
	SecretKey     string
	ExpiresInHour time.Duration
}

type BaseUrls struct {
	FrontEndUrl string
	BackEndUrl  string
}

type Stripe struct {
	SecretKey              string
	WebhookSecret          string
	WebhookSecretConnected string
	PublishableKey         string
}

type SMTPConfig struct {
	Server   string
	Port     int
	Username string
	Password string
	From     string
}

func LoadConfig() (*Config, error) {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("[CONFIG] .env file not found; falling back to system environment variables.")
		} else {
			return nil, fmt.Errorf("[CONFIG] error reading .env file: %w", err)
		}
	}

	setDefaults()

	if viper.GetString("JWT_SECRET_KEY") == "" {
		return nil, fmt.Errorf("[CONFIG] JWT_SECRET_KEY is required but not set")
	}

	cfg := &Config{
		Server: ServerConfig{
			Port:         viper.GetString("SERVER_PORT"),
			ReadTimeout:  viper.GetDuration("SERVER_READ_TIMEOUT"),
			WriteTimeout: viper.GetDuration("SERVER_WRITE_TIMEOUT"),
			Debug:        viper.GetBool("SERVER_DEBUG"),
		},
		Database: DatabaseConfig{
			Host:     viper.GetString("DATABASE_HOST"),
			Port:     viper.GetString("DATABASE_PORT"),
			User:     viper.GetString("DATABASE_USER"),
			Password: viper.GetString("DATABASE_PASSWORD"),
			DBName:   viper.GetString("DATABASE_DBNAME"),
			SSLMode:  viper.GetString("DATABASE_SSL"),
		},
		Redis: RedisConfig{
			URL: viper.GetString("REDIS_URL"),
		},
		Session: SessionConfig{
			KEY: viper.GetString("SESSION_SECRET"),
		},
		JWT: JWTConfig{
			SecretKey:     viper.GetString("JWT_SECRET_KEY"),
			ExpiresInHour: viper.GetDuration("JWT_EXPIRES_IN_HOUR"),
		},
		Google: GoogleConfig{
			ClientID:     viper.GetString("CLIENT_ID"),
			ClientSecret: viper.GetString("CLIENT_SECRET"),
			RedirectURL:  viper.GetString("REDIRECT_URL"),
		},
		AWS: AWSConfig{
			AccessKeyID:     viper.GetString("AWS_ACCESS_KEY_ID"),
			SecretAccessKey: viper.GetString("AWS_SECRET_ACCESS_KEY"),
			Region:          viper.GetString("AWS_REGION"),
			Bucket:          viper.GetString("AWS_BUCKET"),
		},

		BaseUrl: BaseUrls{
			FrontEndUrl: viper.GetString("FRONTEND_URL"),
			BackEndUrl:  viper.GetString("BACKEND_URL"),
		},

		Stripe: Stripe{
			SecretKey:              viper.GetString("STRIPE_SECRET_KEY"),
			WebhookSecret:          viper.GetString("STRIPE_WEBHOOK_SECRET"),
			WebhookSecretConnected: viper.GetString("STRIPE_WEBHOOK_SECRET_CONNECTED"),
			PublishableKey:         viper.GetString("STRIPE_PUBLISHABLE_KEY"),
		},
		Email: SMTPConfig{
			Server:   viper.GetString("SMTP_SERVER"),
			Port:     viper.GetInt("SMTP_PORT"),
			Username: viper.GetString("SMTP_USERNAME"),
			Password: viper.GetString("SMTP_PASSWORD"),
			From:     viper.GetString("SMTP_FROM"),
		},
		Geocode: GeocodeConfig{
			APIKey: viper.GetString("GEOCODE_API_KEY"),
		},
	}

	return cfg, nil
}

func setDefaults() {
	viper.SetDefault("SERVER_PORT", "8080")
	viper.SetDefault("SERVER_READ_TIMEOUT", "10s")
	viper.SetDefault("SERVER_WRITE_TIMEOUT", "15s")
	viper.SetDefault("SERVER_DEBUG", false)

	viper.SetDefault("JWT_EXPIRES_IN_HOUR", "24h")
}
