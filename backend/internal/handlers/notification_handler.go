package handlers

import (
	"backend/internal/services"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	service services.NotificationService
}

func NewNotificationHandler(service services.NotificationService) *NotificationHandler {
	return &NotificationHandler{service: service}
}

func (h *NotificationHandler) GetByUser(c *gin.Context) {
	userID := c.GetString("userID")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	notifs, total, err := h.service.GetByUser(c.Request.Context(), userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       notifs,
		"page":       page,
		"limit":      limit,
		"total":      total,
		"totalPages": int(math.Ceil(float64(total) / float64(limit))),
	})
}

func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	userID := c.GetString("userID")
	notifID := c.Param("id")

	if err := h.service.MarkAsRead(c.Request.Context(), notifID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "notification marked as read"})
}

func (h *NotificationHandler) Delete(c *gin.Context) {
	userID := c.GetString("userID")
	notifID := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), notifID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *NotificationHandler) GetUnreadCount(c *gin.Context) {
	userID := c.GetString("userID")

	count, err := h.service.GetUnreadCount(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}
