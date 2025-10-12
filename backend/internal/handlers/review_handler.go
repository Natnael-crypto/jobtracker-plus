package handlers

import (
	"backend/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ReviewHandler struct {
	service services.ReviewService
}

func NewReviewHandler(service services.ReviewService) *ReviewHandler {
	return &ReviewHandler{service: service}
}

func (h *ReviewHandler) CreateReview(c *gin.Context) {
	reviewerID := c.GetString("userID")
	jobID := c.Param("jobID")

	var req struct {
		Rate    int    `json:"rate" binding:"required"`
		Comment string `json:"comment" binding:"required"`
		UserID  string `json:"user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review, err := h.service.Create(jobID, reviewerID, req.Rate, req.Comment, req.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, review)
}

func (h *ReviewHandler) UpdateReview(c *gin.Context) {
	reviewerID := c.GetString("userID")
	reviewID := c.Param("id")

	var req struct {
		Rate    int    `json:"rate"`
		Comment string `json:"comment"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review, err := h.service.Update(reviewID, reviewerID, req.Rate, req.Comment)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, review)
}

func (h *ReviewHandler) GetReviewsOfUser(c *gin.Context) {
	userID := c.Param("userID")

	reviews, err := h.service.GetReviewsOfUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, reviews)
}

func (h *ReviewHandler) GetUserRating(c *gin.Context) {
	userID := c.Param("userID")

	rating, err := h.service.GetUserRating(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"rating":  strconv.FormatFloat(rating, 'f', 2, 64),
	})
}

func (h *ReviewHandler) GetAllUserReviews(c *gin.Context) {
	userID := c.Param("user_id")

	reviews, err := h.service.GetReviewsOfUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if reviews == nil {
		reviews = []services.UserReview{}
		c.JSON(http.StatusOK, gin.H{"reviews": reviews})
		return
	}
	c.JSON(http.StatusOK, gin.H{"reviews": reviews})
}
