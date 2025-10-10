package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type JobBidHandler struct {
	service services.JobBidService
}

func NewJobBidHandler(service services.JobBidService) *JobBidHandler {
	return &JobBidHandler{service: service}
}

// POST /jobs/:jobID/bids
func (h *JobBidHandler) CreateBid(c *gin.Context) {
	jobID := c.Param("job_id")
	userID := c.GetString("userID")
	role := c.GetString("role")

	bid, err := h.service.CreateBid(jobID, userID, role)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, bid)
}

// PUT /bids/:id/withdraw
func (h *JobBidHandler) WithdrawBid(c *gin.Context) {
	bidID := c.Param("id")
	userID := c.GetString("userID")
	role := c.GetString("role")

	if err := h.service.WithdrawBid(bidID, userID, role); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "bid withdrawn"})
}

// PUT /bids/:id/status
func (h *JobBidHandler) UpdateBidStatus(c *gin.Context) {
	bidID := c.Param("id")
	role := c.GetString("role")
	userID := c.GetString("userID")

	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateBidStatus(bidID, req.Status, role, userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "status updated"})
}

// GET /jobs/:jobID/bids
func (h *JobBidHandler) GetBidsByJob(c *gin.Context) {
	jobID := c.Param("job_id")
	bids, err := h.service.GetBidsByJob(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, bids)
}

// GET /jobs/:jobID/bids/:userID
func (h *JobBidHandler) GetBid(c *gin.Context) {
	jobID := c.Param("job_id")
	userID := c.GetString("userID")

	bid, err := h.service.GetBid(jobID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "bid not found"})
		return
	}
	c.JSON(http.StatusOK, bid)
}

func (h *JobBidHandler) GetMyBidStat(c *gin.Context) {
	userID := c.GetString("userID")
	BidStat, err := h.service.GetMyBidStat(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "bid stat not found"})
		return
	}
	c.JSON(http.StatusOK, BidStat)
}

func (h *JobBidHandler) GetAllBidsForJobByState(c *gin.Context) {
	jobID := c.Param("job_id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing job ID"})
		return
	}

	result, err := h.service.GetAllBidsForJobByState(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch job bids"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *JobBidHandler) GetBidOfUserByJobID(c *gin.Context) {
	jobID := c.Param("job_id")
	userID := c.Param("user_id")
	//TODO Authorization Check
	result, err := h.service.GetBidByUserProfileID(jobID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch job bid"})
		return
	}
	c.JSON(http.StatusOK, result)

}

func (h *JobBidHandler) GetBidStats(c *gin.Context) {
	jobID := c.Param("job_id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "jobID is required"})
		return
	}

	stats, err := h.service.GetBidStatsByJobID(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get bid stats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": stats})
}
