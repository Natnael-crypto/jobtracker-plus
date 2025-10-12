// package: diditclient
package diditclient

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Config struct {
	BaseURL       string // e.g. https://api.didit.me
	AppID         string
	APIKey        string
	WebhookSecret string // optional: used to verify inbound webhook signatures
	HTTPTimeout   time.Duration
	MaxRetries    int
}

type Client struct {
	cfg    Config
	client *http.Client
}

func NewClient(cfg Config) *Client {
	if cfg.HTTPTimeout == 0 {
		cfg.HTTPTimeout = 10 * time.Second
	}
	if cfg.MaxRetries <= 0 {
		cfg.MaxRetries = 3
	}
	return &Client{
		cfg: cfg,
		client: &http.Client{
			Timeout: cfg.HTTPTimeout,
		},
	}
}

// CreateVerificationRequest models what your app sends to Didit to create a verification.
// Adjust the fields to match Didit's API contract exactly.
type CreateVerificationRequest struct {
	// Minimal example fields — adapt to Didit's docs:
	AppID       string `json:"app_id"`
	CallbackURL string `json:"callback_url,omitempty"` // where Didit should post results
	Customer    struct {
		UserID string `json:"user_id"`
		Email  string `json:"email,omitempty"`
		Name   string `json:"name,omitempty"`
	} `json:"customer"`
	// Optional: metadata, user-provided ID, document types, etc.
	Metadata map[string]string `json:"metadata,omitempty"`
}

type CreateVerificationResponse struct {
	// Adapt to Didit's response contract
	ExternalID      string          `json:"id,omitempty"`  // external verification id
	VerificationURL string          `json:"url,omitempty"` // where user completes verification
	Status          string          `json:"status,omitempty"`
	Raw             json.RawMessage `json:"-"`
}

// CreateVerification starts a verification session at Didit and returns data
func (c *Client) CreateVerification(ctx context.Context, req CreateVerificationRequest) (*CreateVerificationResponse, error) {
	url := fmt.Sprintf("%s/v1/standalone/verifications", c.cfg.BaseURL) // adjust path if docs differ
	bodyBytes, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	var lastErr error
	var respBody []byte
	for attempt := 0; attempt < c.cfg.MaxRetries; attempt++ {
		httpReq, _ := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(bodyBytes))
		// set required headers:
		httpReq.Header.Set("Content-Type", "application/json")
		httpReq.Header.Set("X-App-Id", c.cfg.AppID)
		httpReq.Header.Set("X-Api-Key", c.cfg.APIKey)
		// Some APIs require Authorization: Bearer <key> — adapt if needed.
		// httpReq.Header.Set("Authorization", "Bearer "+c.cfg.APIKey)

		resp, err := c.client.Do(httpReq)
		if err != nil {
			lastErr = err
			// backoff
			sleep := time.Duration(100*(1<<attempt)) * time.Millisecond
			time.Sleep(sleep)
			continue
		}

		defer resp.Body.Close()
		respBody, err = io.ReadAll(resp.Body)
		if err != nil {
			lastErr = err
			continue
		}

		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			// parse
			var out CreateVerificationResponse
			if err := json.Unmarshal(respBody, &out); err != nil {
				// keep raw
				out.Raw = json.RawMessage(respBody)
				return &out, err
			}
			out.Raw = json.RawMessage(respBody)
			return &out, nil
		}

		// non-2xx -> treat as retryable for 5xx
		if resp.StatusCode >= 500 && resp.StatusCode < 600 {
			lastErr = fmt.Errorf("didit: server error %d: %s", resp.StatusCode, string(respBody))
			time.Sleep(time.Duration(100*(1<<attempt)) * time.Millisecond)
			continue
		}

		// 4xx: probably client error - don't retry
		return nil, fmt.Errorf("didit: unexpected status %d: %s", resp.StatusCode, string(respBody))
	}

	return nil, lastErr
}

// ValidateWebhookSignature validates a HMAC-SHA256 signature (common pattern).
// The exact validation method depends on Didit webhook docs; adapt as needed.
func (c *Client) ValidateWebhookSignature(body []byte, signatureHeader string) bool {
	if c.cfg.WebhookSecret == "" || signatureHeader == "" {
		// no secret configured — cannot validate; choose to reject or accept depending on policy
		return false
	}
	mac := hmac.New(sha256.New, []byte(c.cfg.WebhookSecret))
	mac.Write(body)
	expected := hex.EncodeToString(mac.Sum(nil))
	// constant-time compare
	return hmac.Equal([]byte(expected), []byte(signatureHeader))
}
