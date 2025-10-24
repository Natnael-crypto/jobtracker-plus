package handlers

import (
	"backend/internal/services"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreditRefundHandler struct {
	service *services.CreditRefundService
}

func NewCreditRefundHandler(service *services.CreditRefundService) *CreditRefundHandler {
	return &CreditRefundHandler{service: service}
}

type CreateRefundRequest struct {
	CreditUsageID string `json:"credit_usage_id" binding:"required"`
	UserReason    string `json:"user_reason" binding:"required"`
}

func (h *CreditRefundHandler) CreateRefundRequest(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req CreateRefundRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	_, err := h.service.CreateRefundRequest(userID, req.CreditUsageID, req.UserReason)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "refund request created"})
}

type UpdateRefundStatusRequest struct {
	Status      string `json:"status" binding:"required,oneof=approved rejected"`
	AdminReason string `json:"admin_reason"`
}

func (h *CreditRefundHandler) UpdateRefundStatus(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "refund id required"})
		return
	}

	var req UpdateRefundStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	if err := h.service.UpdateRefundStatus(id, req.Status, req.AdminReason); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "refund status updated"})
}

// GET /api/refunds?page=1&limit=10
func (h *CreditRefundHandler) GetRefundRequestsByUser(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	refunds, total, err := h.service.GetRefundRequestsByUser(userID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":        refunds,
		"total":       total,
		"page":        page,
		"limit":       limit,
		"total_pages": (total + int64(limit) - 1) / int64(limit),
	})
}

// GET /api/admin/refunds?search=&user_id=&status=&page=1&limit=10
func (h *CreditRefundHandler) GetRefundRequestsByAdmin(c *gin.Context) {
	search := strings.TrimSpace(c.Query("search"))
	userID := strings.TrimSpace(c.Query("user_id"))
	status := strings.TrimSpace(c.Query("status"))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	refunds, total, err := h.service.GetRefundRequestsByAdmin(search, userID, status, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":        refunds,
		"total":       total,
		"page":        page,
		"limit":       limit,
		"total_pages": (total + int64(limit) - 1) / int64(limit),
	})
}

func (h *CreditRefundHandler) GetJobDetail(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Id is needed"})
		return
	}
	response, err := h.service.GetJobDetail(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, response)
}
