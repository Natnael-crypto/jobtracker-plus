package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ServiceHandler struct {
	service services.ServiceService
}

func NewServiceHandler(service services.ServiceService) *ServiceHandler {
	return &ServiceHandler{service: service}
}

func (h *ServiceHandler) CreateService(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		ServiceName string `json:"service_name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	svc, err := h.service.CreateService(userID, req.ServiceName)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusCreated, svc)
}

func (h *ServiceHandler) DeleteService(c *gin.Context) {
	userID := c.GetString("userID")
	serviceID := c.Param("service_id")

	if err := h.service.DeleteService(userID, serviceID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "service deleted"})
}

func (h *ServiceHandler) GetServices(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id required"})
		return
	}

	services, err := h.service.GetServices(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, services)
}

func (h *ServiceHandler) GetMyServices(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id required"})
		return
	}

	services, err := h.service.GetServices(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, services)
}
