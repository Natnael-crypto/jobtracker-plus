package handlers

import (
	"backend/internal/services"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type EventHandler struct {
	service services.EventService
}

func NewEventHandler(service services.EventService) *EventHandler {
	return &EventHandler{service: service}
}

func (h *EventHandler) CreateEvent(c *gin.Context) {
	userID := c.GetString("userID")

	var req struct {
		Title       string  `json:"title" binding:"required"`
		Day         string  `json:"day" binding:"required"` // format: YYYY-MM-DD
		StartTime   string  `json:"start_time" binding:"required"`
		EndTime     string  `json:"end_time" binding:"required"`
		Description string  `json:"description"`
		JobID       *string `json:"job_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	day, err := time.Parse("2006-01-02", req.Day)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid day format"})
		return
	}

	event, err := h.service.Create(userID, req.Title, req.StartTime, req.EndTime, req.Description, day, req.JobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusCreated, event)
}

func (h *EventHandler) UpdateEvent(c *gin.Context) {
	userID := c.GetString("userID")
	eventID := c.Param("id")

	var req struct {
		Title       string  `json:"title" binding:"required"`
		Day         string  `json:"day" binding:"required"`
		StartTime   string  `json:"start_time" binding:"required"`
		EndTime     string  `json:"end_time" binding:"required"`
		Description string  `json:"description"`
		JobID       *string `json:"job_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	pureDate := strings.Split(req.Day, "T")
	day, err := time.Parse("2006-01-02", pureDate[0])
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid day format"})
		return
	}

	event, err := h.service.Update(eventID, userID, req.Title, req.StartTime, req.EndTime, req.Description, day, req.JobID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, event)
}

func (h *EventHandler) GetEventsByDay(c *gin.Context) {
	userID := c.GetString("userID")
	day := c.Query("day") // expect YYYY-MM-DD

	if day == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "day query param required"})
		return
	}

	events, err := h.service.GetByDay(userID, day)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, events)
}

func (h *EventHandler) DeleteEvent(c *gin.Context) {
	userID := c.GetString("userID")
	eventID := c.Param("id")

	if err := h.service.Delete(eventID, userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error":  ""})
		return
	}
	c.Status(http.StatusNoContent)
}
