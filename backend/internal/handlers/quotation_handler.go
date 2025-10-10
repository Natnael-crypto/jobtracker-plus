package handlers

import (
	"backend/internal/models"
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type QuotationHandler struct {
	service services.QuotationService
}

func NewQuotationHandler(service services.QuotationService) *QuotationHandler {
	return &QuotationHandler{service: service}
}

//TODO Add Authorization

// POST /quotations
func (h *QuotationHandler) Create(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		JobID              string                   `json:"job_id" binding:"required"`
		Discount           float64                  `json:"discount"`
		Tax                float64                  `json:"tax"`
		TermsAndConditions string                   `json:"terms_and_conditions"`
		Street             string                   `json:"street"`
		City               string                   `json:"city"`
		State              string                   `json:"state"`
		Country            string                   `json:"country"`
		Phone              string                   `json:"phone"`
		Email              string                   `json:"email"`
		LogoUrl            string                   `json:"logo_url"`
		JobTitle           string                   `json:"job_title"`
		LineItems          []models.LineItemRequest `json:"line_items"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	quotation, items, err := h.service.Create(c.Request.Context(), userID, req.JobID, req.Discount, req.Tax, req.TermsAndConditions, req.Street, req.City, req.State, req.Country, req.Phone, req.Email, req.LogoUrl, req.JobTitle, req.LineItems)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"quotation": quotation, "line_items": items})
}

func (h *QuotationHandler) GetByJobID(c *gin.Context) {
	jobID := c.Param("job_id")
	userID := c.Param("user_id")

	quotations, itemsMap, err := h.service.GetByJobID(c.Request.Context(), userID, jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Combine quotations and their line items
	var result []gin.H
	for _, q := range quotations {
		result = append(result, gin.H{
			"quotation":  q,
			"line_items": itemsMap[q.ID],
		})
	}

	c.JSON(http.StatusOK, result)
}

func (h *QuotationHandler) GetByQuoteID(c *gin.Context) {
	id := c.Param("id")
	quotation, items, err := h.service.GetByQuoteID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"quotation": quotation, "line_items": items})
}

// DELETE /quotations/:id
func (h *QuotationHandler) Delete(c *gin.Context) {
	userID := c.GetString("userID")
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// GET /quotations
func (h *QuotationHandler) GetByUser(c *gin.Context) {
	userID := c.GetString("userID")
	id := c.Param("job_id")
	quotations, err := h.service.GetByUser(c.Request.Context(), userID, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, quotations)
}

func (h *QuotationHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.service.UpdateStatus(c.Request.Context(), id, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
