package services

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/repositories"
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type VerificationService struct {
	Repo                *repositories.UserVerificationRepository
	Conf                config.Config
	NotificationService *NotificationService
}

func NewVerificationService(repo *repositories.UserVerificationRepository, Conf config.Config) *VerificationService {
	return &VerificationService{Repo: repo, Conf: Conf}
}

type CreateSessionResponse struct {
	ID     string `json:"id"`
	Status string `json:"status"`
	URL    string `json:"url"`
}

// CreateVerificationSession creates a new Didit verification session for a user.
func (s *VerificationService) CreateVerificationSession(userID string) (*CreateSessionResponse, error) {
	body := map[string]interface{}{
		"type": "identity",
		"metadata": map[string]string{
			"user_id": userID,
		},
		"callback":    s.Conf.BaseUrl.BackEndUrl + "/business/profile",
		"workflow_id": s.Conf.Didit.WorkFlow,
	}

	jsonBody, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", "https://verification.didit.me/v2/session/", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", s.Conf.Didit.ApiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("failed to create session: %s", resp.Status)
	}

	var data CreateSessionResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return &data, nil
}

// VerifyWebhookSignature validates the HMAC signature sent by Didit.
func (s *VerificationService) VerifyWebhookSignature(signature, timestamp string, rawBody []byte) error {

	// Step 1: Ensure the request timestamp is recent (±5 minutes)
	currentTime := time.Now().Unix()
	incomingTime, err := time.ParseDuration(fmt.Sprintf("%ss", timestamp))
	if err != nil {
		// fallback: parse manually if timestamp is just an int
		incomingUnix, convErr := parseUnixTimestamp(timestamp)
		if convErr != nil {
			return fmt.Errorf("invalid timestamp: %v", err)
		}
		if abs(currentTime-incomingUnix) > 300 {
			return fmt.Errorf("request timestamp is stale")
		}
	} else {
		if abs(currentTime-int64(incomingTime.Seconds())) > 300 {
			return fmt.Errorf("request timestamp is stale")
		}
	}

	// Step 2: Compute HMAC SHA256 of the raw body
	h := hmac.New(sha256.New, []byte(s.Conf.Didit.Secret))
	h.Write(rawBody)
	expectedSig := hex.EncodeToString(h.Sum(nil))

	// Step 3: Compare signatures safely
	if !hmac.Equal([]byte(expectedSig), []byte(signature)) {
		return fmt.Errorf("invalid signature: expected %s, got %s", expectedSig, signature)
	}

	return nil
}

// HandleWebhook processes the verified webhook payload from Didit.
func (s *VerificationService) HandleWebhook(headers http.Header, rawBody []byte) error {
	signature := headers.Get("X-Signature")
	timestamp := headers.Get("X-Timestamp")

	if err := s.VerifyWebhookSignature(signature, timestamp, rawBody); err != nil {
		return fmt.Errorf("signature verification failed: %v", err)
	}

	var event map[string]interface{}
	if err := json.Unmarshal(rawBody, &event); err != nil {
		return fmt.Errorf("invalid JSON payload: %v", err)
	}

	sessionID, _ := event["session_id"].(string)
	status, _ := event["status"].(string)

	fmt.Printf("Webhook received: SessionID=%s | Status=%s\n", sessionID, status)

	if status == "approved" || status == "verified" {
		if err := s.Repo.UpdateVerified(sessionID, true); err != nil {
			return fmt.Errorf("failed to update verification: %v", err)
		}
		verify, err := s.Repo.GetBySessionID(sessionID)
		if err != nil {
			return fmt.Errorf("failed to get user by session ID: %v", err)
		}

		fmt.Printf("User verification updated successfully for session %s\n", sessionID)
		s.NotificationService.Create(context.Background(), verify.UserID, "Welcome to JobTracker!", "")
	}
	return nil
}

func (s *VerificationService) CheckIdentityVerification(userID string) (*models.UserVerification, error) {
	return s.Repo.GetByUserID(userID, "identity")
}

// Helper function to handle numeric timestamps safely
func parseUnixTimestamp(ts string) (int64, error) {
	var unixTime int64
	_, err := fmt.Sscan(ts, &unixTime)
	return unixTime, err
}

func abs(x int64) int64 {
	if x < 0 {
		return -x
	}
	return x
}
