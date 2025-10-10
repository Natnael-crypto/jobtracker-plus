package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type QualificationHandler struct {
	service services.QualificationService
}

func NewQualificationHandler(service services.QualificationService) *QualificationHandler {
	return &QualificationHandler{service: service}
}

func (h *QualificationHandler) CreateQualification(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Type        string `json:"type" binding:"required,oneof=Education Award"`
		Title       string `json:"title"`
		StartYear   int    `json:"start_year"`
		EndYear     int    `json:"end_year"`
		Institute   string `json:"institute"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	q, err := h.service.CreateQualification(userID, req.Title, req.Institute, req.Description, req.Type, req.StartYear, req.EndYear)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, q)
}

func (h *QualificationHandler) UpdateQualification(c *gin.Context) {
	userID := c.GetString("userID")
	qualificationID := c.Param("qualification_id")
	var req struct {
		Title       string `json:"title"`
		StartYear   int    `json:"start_year"`
		EndYear     int    `json:"end_year"`
		Institute   string `json:"institute"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	q, err := h.service.UpdateQualification(userID, qualificationID, req.Title, req.Institute, req.Description, req.StartYear, req.EndYear)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, q)
}

func (h *QualificationHandler) DeleteQualification(c *gin.Context) {
	userID := c.GetString("userID")
	qualificationID := c.Param("qualification_id")

	if err := h.service.DeleteQualification(userID, qualificationID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "qualification deleted"})
}

func (h *QualificationHandler) GetMyQualifications(c *gin.Context) {
	userID := c.GetString("userID")

	qualifications, err := h.service.GetQualifications(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, qualifications)
}

func (h *QualificationHandler) GetUserQualifications(c *gin.Context) {
	userID := c.Param("user_id")

	qualifications, err := h.service.GetQualifications(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, qualifications)
}
