package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BusinessRangeHandler struct {
	service services.BusinessRangeService
}

func NewBusinessRangeHandler(service services.BusinessRangeService) *BusinessRangeHandler {
	return &BusinessRangeHandler{service: service}
}

func (h *BusinessRangeHandler) UpdateBusinessRange(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		RangeKm int `json:"range_km" binding:"required,gt=0"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	br, err := h.service.UpdateBusinessRange(userID, req.RangeKm)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, br)
}

func (h *BusinessRangeHandler) GetBusinessRange(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	br, err := h.service.GetBusinessRange(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, br)
}
