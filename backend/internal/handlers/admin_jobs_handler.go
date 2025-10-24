package handlers

import (
	"backend/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AdminJobHandlers struct {
	service *services.AdminJobServices
}

func NewAdminJobHandlers(service *services.AdminJobServices) *AdminJobHandlers {
	return &AdminJobHandlers{service: service}
}

func (h *AdminJobHandlers) GetJobs(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	search := c.Query("search")
	status := c.Query("status")

	jobs, total, err := h.service.GetJobs(limit, offset, search, status)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total":  total,
		"limit":  limit,
		"offset": offset,
		"data":   jobs,
	})
}
