package handlers

import (
	"backend/internal/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type JobImageHandler struct {
	service *services.JobImageService
}

func NewJobImageHandler(service *services.JobImageService) *JobImageHandler {
	return &JobImageHandler{service: service}
}

// POST /jobs/:jobID/images
func (h *JobImageHandler) CreateJobImage(c *gin.Context) {
	jobID := c.Param("job_id")

	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid file"})
		return
	}
	defer file.Close()

	jobImage, err := h.service.CreateJobImage(c.Request.Context(), jobID, file, header)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, jobImage)
}

// GET /jobs/:jobID/images
func (h *JobImageHandler) GetJobImages(c *gin.Context) {
	jobID := c.Param("job_id")

	images, err := h.service.GetJobImages(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch images"})
		return
	}

	c.JSON(http.StatusOK, images)
}

// DELETE /images/:id
func (h *JobImageHandler) DeleteJobImage(c *gin.Context) {
	imageID := c.Param("id")
	images := strings.Split(imageID, ".")
	userID := c.GetString("userID")

	if err := h.service.DeleteJobImage(c.Request.Context(), images[0], userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
