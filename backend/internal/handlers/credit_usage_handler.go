package handlers

import (
	"backend/internal/services"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreditUsageHandler struct {
	service *services.CreditUsageService
}

func NewCreditUsageHandler(service *services.CreditUsageService) *CreditUsageHandler {
	return &CreditUsageHandler{service: service}
}

type CreateCreditRequest struct {
	JobID  string `json:"job_id" binding:"required"`
	Reason string `json:"reason" binding:"required"`
	Credit int    `json:"credit" binding:"required,min=1"`
}

func (h *CreditUsageHandler) GetCreditUsagesByUser(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := ""
	reason := ""
	refundedQuery := c.Query("refunded")

	var refunded *bool
	if refundedQuery != "" {
		val := refundedQuery == "true"
		refunded = &val
	}

	credits, total, err := h.service.GetCreditUsagesByUser(userID, search, reason, refunded, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":        credits,
		"total":       total,
		"page":        page,
		"limit":       limit,
		"total_pages": (total + int64(limit) - 1) / int64(limit),
	})
}

func (h *CreditUsageHandler) GetCreditUsagesByAdmin(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := strings.TrimSpace(c.Query("search"))
	userID := strings.TrimSpace(c.Query("user_id"))
	reason := strings.TrimSpace(c.Query("reason"))
	refundedQuery := c.Query("refunded")

	var refunded *bool
	if refundedQuery != "" {
		val := refundedQuery == "true"
		refunded = &val
	}

	credits, total, err := h.service.GetCreditUsagesAdmin(search, userID, reason, refunded, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":        credits,
		"total":       total,
		"page":        page,
		"limit":       limit,
		"total_pages": (total + int64(limit) - 1) / int64(limit),
	})
}
