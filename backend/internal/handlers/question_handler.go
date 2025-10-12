package handlers

import (
	"backend/internal/services"
	"backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type QuestionHandler struct {
	svc services.QuestionService
}

func NewQuestionHandler(s services.QuestionService) *QuestionHandler {
	return &QuestionHandler{svc: s}
}

type createQuestionRequest struct {
	Title    string `json:"title" binding:"required,min=3,max=255"`
	Content  string `json:"content"`
	Category string `json:"category" binding:"required"`
}

type updateQuestionRequest struct {
	Title    string `json:"title" binding:"required,min=3,max=255"`
	Content  string `json:"content"`
	Category string `json:"category" binding:"required"`
}

func (h *QuestionHandler) Create(c *gin.Context) {
	var req createQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}
	q, err := h.svc.CreateQuestion(c.Request.Context(), userID, req.Title, req.Content, req.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, q)
}

func (h *QuestionHandler) List(c *gin.Context) {
	page, limit := utils.ParsePagination(c)
	offset := (page - 1) * limit
	search := c.Query("search")
	category := c.Query("category")
	sort := c.Query("sort")
	my := c.Query("my")
	userID := ""
	if my == "true" {
		userID = c.GetString("userID")
		if userID == "" {
			my = "false"
		}
	}

	list, total, err := h.svc.ListQuestions(c.Request.Context(), search, category, sort, offset, limit, my == "true", userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	utils.WritePaginatedResponse(c, list, page, limit, int(total))
}

func (h *QuestionHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	q, err := h.svc.GetQuestionByID(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "question not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, q)
}

func (h *QuestionHandler) Update(c *gin.Context) {
	var req updateQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}
	id := c.Param("id")
	q, err := h.svc.UpdateQuestion(c.Request.Context(), userID, id, req.Title, req.Content, req.Category)
	if err != nil {
		switch err {
		case services.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		case services.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, q)
}

func (h *QuestionHandler) Delete(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}
	id := c.Param("id")
	if err := h.svc.DeleteQuestion(c.Request.Context(), userID, id); err != nil {
		switch err {
		case services.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		case services.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}
	c.Status(http.StatusNoContent)
}
