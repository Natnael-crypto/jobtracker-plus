package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type JobInvitationHandler struct {
	service services.JobInvitationService
}

func NewJobInvitationHandler(service services.JobInvitationService) *JobInvitationHandler {
	return &JobInvitationHandler{service: service}
}

func (h *JobInvitationHandler) CreateInvitation(c *gin.Context) {
	jobID := c.Param("job_id")
	businessID := c.Param("business_id")
	role := c.GetString("role")
	userID := c.GetString("userID")

	invite, err := h.service.CreateInvitation(jobID, businessID, role, userID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, invite)
}

func (h *JobInvitationHandler) UpdateInvitationStatus(c *gin.Context) {
	inviteID := c.Param("id")
	role := c.GetString("role")
	userID := c.GetString("userID")

	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateInvitationStatus(inviteID, req.Status, role, userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "status updated"})
}

func (h *JobInvitationHandler) GetInvitationsByUser(c *gin.Context) {
	businessID := c.Param("userID")

	invites, err := h.service.GetInvitationsByUser(businessID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, invites)
}

func (h *JobInvitationHandler) GetInvitationsByJob(c *gin.Context) {
	jobID := c.Param("job_id")

	invites, err := h.service.GetInvitationsByJob(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, invites)
}

func (h *JobInvitationHandler) GetInvitationsByJobUserID(c *gin.Context) {
	jobID := c.Param("job_id")
	userID := c.Param("user_id")

	invite, err := h.service.GetInvitationsByJobUserID(jobID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, invite)
}

func (h *JobInvitationHandler) GetInvitationStats(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "jobID is required"})
		return
	}

	stats, err := h.service.GetInvitationStatusStats(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get bid stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *JobInvitationHandler) GetJobInvitationForUser(c *gin.Context) {
	jobID := c.Param("job_id")
	userID := c.GetString("userID")

	invite, err := h.service.GetByJobForUser(jobID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, invite)

}
