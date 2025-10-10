package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type JobAddressHandler struct {
	service *services.JobAddressService
}

func NewJobAddressHandler(service *services.JobAddressService) *JobAddressHandler {
	return &JobAddressHandler{service: service}
}

func (h *JobAddressHandler) CreateJobAddress(c *gin.Context) {
	jobID := c.Param("job_id")
	userID := c.GetString("userID")

	var req struct {
		Street  string `json:"street" binding:"required"`
		City    string `json:"city" binding:"required"`
		State   string `json:"state" binding:"required"`
		Zip     string `json:"zip" binding:"required"`
		Country string `json:"country" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, err := h.service.Create(userID, jobID, req.Street, req.City, req.State, req.Zip, req.Country)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, address)
}

func (h *JobAddressHandler) GetJobAddress(c *gin.Context) {
	jobID := c.Param("job_id")

	address, err := h.service.GetByJobID(jobID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job address not found"})
		return
	}

	c.JSON(http.StatusOK, address)
}
