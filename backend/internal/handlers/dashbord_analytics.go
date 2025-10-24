package handlers

import (
	"backend/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DashBoardAnalyticsHandler struct {
	service services.DashBoardAnalytics
}

func NewDashBoardAnalyticsHandler(service services.DashBoardAnalytics) *DashBoardAnalyticsHandler {
	return &DashBoardAnalyticsHandler{service: service}
}

func (h *DashBoardAnalyticsHandler) GetBusinessDashboard(c *gin.Context) {
	userID := c.GetString("userID")
	dashboard, err := h.service.GetBusinessDashboard(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, dashboard)
}

func (h *DashBoardAnalyticsHandler) GetProfileView(c *gin.Context) {
	userID := c.GetString("userID")

	lastDayStr := c.Query("day")
	lastDay := 7
	if lastDayStr != "" {
		if d, err := strconv.Atoi(lastDayStr); err == nil && d > 0 {
			lastDay = d
		}
	}

	profileViews, err := h.service.GetProfileView(userID, lastDay)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusOK, profileViews)
}

func (h *DashBoardAnalyticsHandler) AddProfileView(c *gin.Context) {
	userID := c.Param("user_id")
	err := h.service.AddProfileView(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Profile view added successfully"})
}

func (h *DashBoardAnalyticsHandler) GetClientDashboard(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	data, err := h.service.GetClientDashboard(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch dashboard data"})
		return
	}

	c.JSON(http.StatusOK, data)
}
