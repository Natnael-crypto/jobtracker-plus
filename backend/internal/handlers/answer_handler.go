package handlers

import (
	"backend/internal/services"
	"backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AnswerHandler struct {
	svc services.AnswerService
}

func NewAnswerHandler(s services.AnswerService) *AnswerHandler {
	return &AnswerHandler{svc: s}
}

type createAnswerReq struct {
	Content string `json:"content" binding:"required,min=1"`
}

type updateAnswerReq struct {
	Content string `json:"content" binding:"required,min=1"`
}

func (h *AnswerHandler) Create(c *gin.Context) {
	var req createAnswerReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}
	role := c.GetString("role")
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}
	if role != "business" {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}
	qid := c.Param("qid")
	ans, err := h.svc.CreateAnswer(c.Request.Context(), userID, qid, req.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		return
	}
	c.JSON(http.StatusCreated, ans)
}

func (h *AnswerHandler) List(c *gin.Context) {
	page, limit := utils.ParsePagination(c)
	offset := (page - 1) * limit
	qid := c.Param("qid")
	sort := c.Query("sort")
	list, total, err := h.svc.ListAnswersForQuestion(c.Request.Context(), qid, offset, limit, sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		return
	}
	utils.WritePaginatedResponse(c, list, page, limit, int(total))
}

func (h *AnswerHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	ans, err := h.svc.GetAnswerByID(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "answer not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		return
	}
	c.JSON(http.StatusOK, ans)
}

func (h *AnswerHandler) Update(c *gin.Context) {
	var req updateAnswerReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}
	id := c.Param("id")
	ans, err := h.svc.UpdateAnswer(c.Request.Context(), userID, id, req.Content)
	if err != nil {
		switch err {
		case services.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		case services.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		}
		return
	}
	c.JSON(http.StatusOK, ans)
}

func (h *AnswerHandler) Delete(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}
	id := c.Param("id")
	if err := h.svc.DeleteAnswer(c.Request.Context(), userID, id); err != nil {
		switch err {
		case services.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		case services.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		}
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *AnswerHandler) Like(c *gin.Context) {
	userID := c.GetString("userID")
	answerID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}

	anno_id := c.GetString("anno_id")
	ip := c.GetString("ip")
	if anno_id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing anonymous ID"})
		return
	}

	hasVoted, err := h.svc.HasRecordedVote(c, anno_id, answerID, ip)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		return
	}
	if hasVoted {
		c.JSON(http.StatusBadRequest, gin.H{"error": "already voted"})
		return
	}
	if err := h.svc.RecordedVote(c, anno_id, answerID, ip); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		return
	}

	if err := h.svc.LikeAnswer(c, answerID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
		return
	}

	c.Status(http.StatusOK)
}
