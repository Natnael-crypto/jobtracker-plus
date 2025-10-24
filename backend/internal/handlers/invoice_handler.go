package handlers

import (
	"backend/internal/models"
	"backend/internal/services"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type InvoiceHandler struct {
	service services.InvoiceService
}

func NewInvoiceHandler(service services.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{service: service}
}

func (h *InvoiceHandler) Create(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		JobID              string                   `json:"job_id" binding:"required"`
		Discount           float64                  `json:"discount"`
		Tax                float64                  `json:"tax"`
		TermsAndConditions string                   `json:"terms_and_conditions"`
		BankAccountName    string                   `json:"bank_account_name"`
		BankAccountNumber  string                   `json:"bank_account_number"`
		BankName           string                   `json:"bank_name"`
		SortCode           string                   `json:"sort_code"`
		BankRoutingNumber  string                   `json:"bank_routing_number"`
		Street             string                   `json:"street"`
		City               string                   `json:"city"`
		State              string                   `json:"state"`
		Country            string                   `json:"country"`
		Phone              string                   `json:"phone"`
		Email              string                   `json:"email"`
		LogoUrl            string                   `json:"logo_url"`
		JobTitle           string                   `json:"job_title"`
		DueDate            time.Time                `json:"due_date" binding:"required"`
		LineItems          []models.LineItemRequest `json:"line_items"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	invoice, items, err := h.service.Create(
		c,
		userID,
		req.JobID,
		req.Discount,
		req.Tax,
		req.TermsAndConditions,
		req.DueDate,
		req.Street,
		req.City,
		req.State,
		req.Country,
		req.Phone,
		req.Email,
		req.LogoUrl,
		req.JobTitle,
		req.BankAccountName,
		req.BankAccountNumber,
		req.BankName,
		req.SortCode,
		req.BankRoutingNumber,
		req.LineItems,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"invoice": invoice, "line_items": items})
}

func (h *InvoiceHandler) GetById(c *gin.Context) {
	id := c.Param("id")
	invoices, itemsList, err := h.service.GetByInvoiceID(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, gin.H{"invoice": invoices, "line_items": itemsList})
}

func (h *InvoiceHandler) GetByInvoiceForBusiness(c *gin.Context) {
	userID := c.GetString("userID")
	id := c.Param("job_id")
	invoice, err := h.service.GetByUserIdJobIdBusiness(c, userID, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, invoice)
}

func (h *InvoiceHandler) GetAllUserInvoices(c *gin.Context) {
	userID := c.GetString("userID")

	// Query params
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if limit > 50 {
		limit = 50
	}
	offset := (page - 1) * limit

	invoices, total, err := h.service.GetAllUserInvoices(c, userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       invoices,
		"total":      total,
		"page":       page,
		"limit":      limit,
		"totalPages": int(math.Ceil(float64(total) / float64(limit))),
	})
}

func (h *InvoiceHandler) GetByInvoiceForClient(c *gin.Context) {
	userID := c.Param("user_id")
	id := c.Param("job_id")
	invoice, err := h.service.GetByUserIdJobId(c, userID, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, invoice)
}

func (h *InvoiceHandler) DeleteByInvoice(c *gin.Context) {
	userID := c.GetString("userID")
	id := c.Param("id")

	if err := h.service.DeleteByJob(c, id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *InvoiceHandler) Update(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")
	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	err := h.service.UpdateStatus(c, id, req.Status, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.Status(http.StatusNoContent)
}
