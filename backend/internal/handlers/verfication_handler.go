package handlers

import (
	"backend/internal/services"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type VerificationHandler struct {
	Service  *services.VerificationService
	Frontend string
}

func NewVerificationHandler(s *services.VerificationService, Frontend string) *VerificationHandler {
	return &VerificationHandler{Service: s, Frontend: Frontend}
}

func (h *VerificationHandler) CreateSession(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	session, err := h.Service.CreateVerificationSession(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, session.URL)
}

func (h *VerificationHandler) Webhook(c *gin.Context) {
	rawBody, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	if err := h.Service.HandleWebhook(c.Request.Header, rawBody); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.Redirect(http.StatusPermanentRedirect, h.Frontend+"/business/profile")
}

func (h *VerificationHandler) Verify(c *gin.Context) {
	userID := c.GetString("userID")
	user, err := h.Service.CheckIdentityVerification(userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"verified": user.Verified})
}
