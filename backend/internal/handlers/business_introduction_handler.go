package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BusinessIntroductionHandler struct {
	service services.BusinessIntroductionService
}

func NewBusinessIntroductionHandler(service services.BusinessIntroductionService) *BusinessIntroductionHandler {
	return &BusinessIntroductionHandler{service: service}
}

func (h *BusinessIntroductionHandler) UpdateIntroduction(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Description string `json:"description" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}

	intro, err := h.service.UpdateIntroduction(userID, req.Description)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}
	c.JSON(http.StatusOK, intro)
}

func (h *BusinessIntroductionHandler) GetIntroduction(c *gin.Context) {
	userID := c.Param("user_id")

	intro, err := h.service.GetIntroduction(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}
	c.JSON(http.StatusOK, intro)
}

func (h *BusinessIntroductionHandler) GetIntroductionMe(c *gin.Context) {
	userID := c.GetString("userID")

	intro, err := h.service.GetIntroduction(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}
	c.JSON(http.StatusOK, intro)
}
