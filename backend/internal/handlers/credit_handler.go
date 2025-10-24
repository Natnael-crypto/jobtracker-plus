package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/services"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/checkout/session"
	"github.com/stripe/stripe-go/v76/webhook"
)

type CreditHandler struct {
	service        services.CreditService
	cfg            *config.Config
	notification   *services.NotificationService
	userProfileRep *repositories.UserProfileRepository
}

type CreditHistory struct {
	ID           string              `json:"id"`
	CreditCharge int                 `json:"credit_change"`
	UserProfile  *models.UserProfile `json:"user_profile"`
	CreatedAt    string              `json:"created_at"`
}

func NewCreditHandler(service services.CreditService, cfg *config.Config, notification *services.NotificationService, userProfileRep *repositories.UserProfileRepository) *CreditHandler {
	return &CreditHandler{service: service, cfg: cfg, notification: notification, userProfileRep: userProfileRep}
}

func (h *CreditHandler) GetCredit(c *gin.Context) {
	userID := c.GetString("userID")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if limit > 50 {
		limit = 50
	}
	offset := (page - 1) * limit

	credit, err := h.service.GetCredit(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	creditHistory, total, err := h.service.GetAllUserCreditHistory(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"credit": credit, "creditHistory": creditHistory, "total": total})
}

func (h *CreditHandler) GetCreditAdmin(c *gin.Context) {

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if limit > 50 {
		limit = 50
	}
	offset := (page - 1) * limit

	creditHistory, total, totalPurchased, err := h.service.GetAllAdminCreditHistory(limit, offset)

	response := make([]CreditHistory, len(creditHistory))

	for i, credit := range creditHistory {
		userProfile, err := h.userProfileRep.GetByUserID(credit.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		response[i] = CreditHistory{
			ID:           credit.ID,
			CreditCharge: credit.CreditChange,
			UserProfile:  userProfile,
			CreatedAt:    credit.CreatedAt.Format("2006-01-02 15:04:05"),
		}
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": response, "total": total, "totalPurchased": totalPurchased})
}

// POST /api/credits/buy
func (h *CreditHandler) BuyCredits(c *gin.Context) {
	userID := c.GetString("userID")

	var req struct {
		Amount int `json:"amount"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid amount"})
		return
	}

	stripe.Key = h.cfg.Stripe.SecretKey

	sessionParams := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		Mode:               stripe.String("payment"),
		CustomerEmail:      stripe.String(c.GetString("email")),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("gbp"),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String("Buy Credits"),
					},
					UnitAmount: stripe.Int64(int64(req.Amount * 100)), // £1 per credit
				},
				Quantity: stripe.Int64(1),
			},
		},
		SuccessURL: stripe.String(h.cfg.BaseUrl.FrontEndUrl + "/business/credits?success=true"),
		CancelURL:  stripe.String(h.cfg.BaseUrl.FrontEndUrl + "/business/credits?canceled=true"),
		Metadata: map[string]string{
			"user_id": userID,
			"amount":  strconv.Itoa(req.Amount),
		},
	}

	s, err := session.New(sessionParams)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create checkout session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": s.URL})
}

func (h *CreditHandler) HandleStripeWebhook(c *gin.Context) {
	const MaxBodyBytes = int64(65536)
	reqBody, err := ioutil.ReadAll(http.MaxBytesReader(c.Writer, c.Request.Body, MaxBodyBytes))
	if err != nil {
		fmt.Println("Error reading request body:", err)
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "read error"})
		return
	}

	endpointSecret := h.cfg.Stripe.WebhookSecret
	event, err := webhook.ConstructEventWithOptions(
		reqBody,
		c.Request.Header.Get("Stripe-Signature"),
		endpointSecret,
		webhook.ConstructEventOptions{
			IgnoreAPIVersionMismatch: true,
		},
	)

	if err != nil {
		fmt.Println("Error verifying webhook signature:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid webhook signature"})
		return
	}

	if event.Type == "checkout.session.completed" {
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err == nil {
			userID := session.Metadata["user_id"]
			amount, _ := strconv.Atoi(session.Metadata["amount"])
			_ = h.service.AddCredits(userID, amount)
			_ = h.service.CreateCreditHistory(userID, amount)
			h.notification.Create(c.Request.Context(), userID, "Credit Purchase Successful", "Your credit purchase was successful. You can now use your balance to submit more job bids or upgrade your plan.")
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}
