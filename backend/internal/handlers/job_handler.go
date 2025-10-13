package handlers

import (
	"backend/internal/models"
	"backend/internal/services"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type JobHandler struct {
	service    *services.JobService
	jobAddress services.JobAddressService
	jobImage   services.JobImageService
	jobBid     services.JobBidService
	jobInvite  services.JobInvitationService
}

func NewJobHandler(service *services.JobService, jobAddress services.JobAddressService, jobImage services.JobImageService, jobBid services.JobBidService, jobInvite services.JobInvitationService) *JobHandler {
	return &JobHandler{service: service, jobAddress: jobAddress, jobImage: jobImage, jobBid: jobBid, jobInvite: jobInvite}
}

func (h *JobHandler) CreateJob(c *gin.Context) {
	userID := c.GetString("userID")
	role := c.GetString("role")
	var req struct {
		Id              string                `json:"id"`
		ServiceCategory string                `json:"service_category" binding:"required"`
		ServiceSpecific string                `json:"service_specific"`
		Time            string                `json:"time"`
		Budget          string                `json:"budget"`
		Description     string                `json:"description"`
		Headline        string                `json:"headline"`
		Location        string                `json:"location"`
		Address         models.AddressRequest `json:"address"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	job, err := h.service.Create(userID, role, req.Id, req.ServiceCategory, req.ServiceSpecific, req.Description, req.Headline, req.Time, req.Budget)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, _ = h.jobAddress.Create(userID, job.ID, req.Address.Label, req.Address.City, req.Address.State, req.Address.PostalCode, req.Address.CountryName)

	c.JSON(http.StatusCreated, job)
}

// PUT /api/jobs/:id
func (h *JobHandler) UpdateJob(c *gin.Context) {
	userID := c.GetString("userID")
	jobID := c.Param("id")

	var req struct {
		ServiceCategory string `json:"service_category" binding:"required"`
		ServiceSpecific string `json:"service_specific"`
		Time            string `json:"time"`
		Budget          string `json:"budget"`
		Description     string `json:"description"`
		Headline        string `json:"headline"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	job, err := h.service.Update(jobID, userID, req.ServiceCategory, req.ServiceSpecific, req.Description, req.Headline, req.Time, req.Budget)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, job)
}

// PATCH /api/jobs/:id/status
func (h *JobHandler) UpdateJobStatus(c *gin.Context) {
	userID := c.GetString("userID")
	jobID := c.Param("id")

	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	job, err := h.service.UpdateStatus(jobID, userID, req.Status)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, job)
}

// DELETE /api/jobs/:id
func (h *JobHandler) DeleteJob(c *gin.Context) {
	userID := c.GetString("userID")
	jobID := c.Param("id")

	if err := h.service.Delete(jobID, userID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "job deleted"})
}

// GET /api/jobs/:id
func (h *JobHandler) GetJob(c *gin.Context) {
	jobID := c.Param("job_id")

	job, err := h.service.GetByID(jobID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		return
	}

	job_address, err := h.jobAddress.GetByJobID(jobID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job address not found"})
		return
	}

	job_images, err := h.jobImage.GetJobImages(jobID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job images not found"})
		return
	}

	job_bids, err := h.jobBid.GetBidsByJob(jobID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job bids not found"})
		return
	}

	jobImages := make([]string, len(job_images))
	for i, image := range job_images {
		jobImages[i] = image.ImageURL
	}

	jobResponse := map[string]interface{}{
		"id":               jobID,
		"service_category": job.ServiceCategory,
		"service_specific": job.ServiceSpecific,
		"time":             job.Time,
		"budget":           job.Budget,
		"description":      job.Description,
		"headline":         job.Headline,
		"status":           job.Status,
		"created_at":       job.CreatedAt,
		"street":           "-----",
		"city":             job_address.City,
		"state":            job_address.State,
		"zip":              "0000",
		"country":          job_address.Country,
		"images":           jobImages,
		"bids":             len(job_bids),
	}

	c.JSON(http.StatusOK, jobResponse)
}

func (h *JobHandler) GetJobs(c *gin.Context) {
	jobs, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func (h *JobHandler) GetJobsForBusiness(c *gin.Context) {
	userID := c.GetString("userID")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	jobs, total, err := h.service.GetJobForBusinessUser(userID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Custom response slice
	var jobsResponse []map[string]interface{}
	for _, job := range jobs {
		// Job Address
		jobAddress, err := h.jobAddress.GetByJobID(job.ID)
		if err != nil {
			continue // skip job if address not found
		}

		// Job Images
		jobImages, _ := h.jobImage.GetJobImages(job.ID)
		if jobImages == nil {
			jobImages = []models.JobImage{}
		}

		// Convert images into string slice
		imageURLs := make([]string, len(jobImages))
		for i, img := range jobImages {
			imageURLs[i] = img.ImageURL
		}

		jobResponse := map[string]interface{}{
			"id":               job.ID,
			"service_category": job.ServiceCategory,
			"service_specific": job.ServiceSpecific,
			"time":             job.Time,
			"budget":           job.Budget,
			"description":      job.Description,
			"headline":         job.Headline,
			"status":           job.Status,
			"created_at":       job.CreatedAt,
			"street":           jobAddress.Street,
			"city":             jobAddress.City,
			"state":            jobAddress.State,
			"zip":              "",
			"country":          jobAddress.Country,
			"images":           imageURLs,
		}

		jobsResponse = append(jobsResponse, jobResponse)
	}

	if len(jobsResponse) == 0 {
		jobsResponse = []map[string]interface{}{}
		c.JSON(http.StatusOK, gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": int(math.Ceil(float64(total) / float64(limit))),
			"data":        jobsResponse,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"page":        page,
		"limit":       limit,
		"total":       total,
		"total_pages": int(math.Ceil(float64(total) / float64(limit))),
		"data":        jobsResponse,
	})
}

func (h *JobHandler) GetShortlistedJobs(c *gin.Context) {
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

	jobs, total, err := h.jobBid.GetShortlistedJobs(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch shortlisted jobs"})
		return
	}

	var jobsResponse []map[string]interface{}
	for _, job := range jobs {
		jobAddress, err := h.jobAddress.GetByJobID(job.ID)
		if err != nil {
			continue
		}

		jobImages, _ := h.jobImage.GetJobImages(job.ID)
		if jobImages == nil {
			jobImages = []models.JobImage{}
		}

		imageURLs := make([]string, len(jobImages))
		for i, img := range jobImages {
			imageURLs[i] = img.ImageURL
		}

		jobResponse := map[string]interface{}{
			"id":               job.ID,
			"service_category": job.ServiceCategory,
			"service_specific": job.ServiceSpecific,
			"time":             job.Time,
			"budget":           job.Budget,
			"description":      job.Description,
			"headline":         job.Headline,
			"status":           job.Status,
			"created_at":       job.CreatedAt,
			"street":           jobAddress.Street,
			"city":             jobAddress.City,
			"state":            jobAddress.State,
			"zip":              "",
			"country":          jobAddress.Country,
			"images":           imageURLs,
		}

		jobsResponse = append(jobsResponse, jobResponse)
	}

	if len(jobsResponse) == 0 {
		jobsResponse = []map[string]interface{}{}
		c.JSON(http.StatusOK, gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": int(math.Ceil(float64(total) / float64(limit))),
			"data":        jobsResponse,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"page":        page,
		"limit":       limit,
		"total":       total,
		"total_pages": int(math.Ceil(float64(total) / float64(limit))),
		"data":        jobsResponse,
	})
}

func (h *JobHandler) GetAwardedJobs(c *gin.Context) {
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

	// --- Fetch awarded jobs from bids ---
	bidJobs, bidTotal, err := h.jobBid.GetAwardedJobs(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch awarded bid jobs"})
		return
	}

	// --- Fetch awarded jobs from invitations ---
	inviteJobs, inviteTotal, err := h.jobInvite.GetAllAwardedInvitationJobs(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch awarded invitation jobs"})
		return
	}

	// --- Combine both sources ---
	allJobs := append(bidJobs, inviteJobs...)
	total := bidTotal + inviteTotal

	// --- Remove duplicate job entries by ID (if the same job appears in both) ---
	uniqueJobs := make(map[string]models.Job)
	for _, job := range allJobs {
		uniqueJobs[job.ID] = job
	}

	// --- Build final response payload ---
	var jobsResponse []map[string]interface{}
	for _, job := range uniqueJobs {
		jobAddress, err := h.jobAddress.GetByJobID(job.ID)
		if err != nil {
			continue
		}

		jobImages, _ := h.jobImage.GetJobImages(job.ID)
		if jobImages == nil {
			jobImages = []models.JobImage{}
		}

		imageURLs := make([]string, len(jobImages))
		for i, img := range jobImages {
			imageURLs[i] = img.ImageURL
		}

		jobResponse := map[string]interface{}{
			"id":               job.ID,
			"service_category": job.ServiceCategory,
			"service_specific": job.ServiceSpecific,
			"time":             job.Time,
			"budget":           job.Budget,
			"description":      job.Description,
			"headline":         job.Headline,
			"status":           job.Status,
			"created_at":       job.CreatedAt,
			"street":           jobAddress.Street,
			"city":             jobAddress.City,
			"state":            jobAddress.State,
			"zip":              "",
			"country":          jobAddress.Country,
			"images":           imageURLs,
		}

		jobsResponse = append(jobsResponse, jobResponse)
	}

	if len(jobsResponse) == 0 {
		jobsResponse = []map[string]interface{}{}
	}

	c.JSON(http.StatusOK, gin.H{
		"page":        page,
		"limit":       limit,
		"total":       total,
		"total_pages": int(math.Ceil(float64(total) / float64(limit))),
		"data":        jobsResponse,
	})
}

func (h *JobHandler) GetInvitedJobs(c *gin.Context) {
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

	jobs, total, err := h.jobInvite.GetAllInvitationJobs(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch shortlisted jobs"})
		return
	}

	var jobsResponse []map[string]interface{}
	for _, job := range jobs {
		jobAddress, err := h.jobAddress.GetByJobID(job.ID)
		if err != nil {
			continue
		}

		jobImages, _ := h.jobImage.GetJobImages(job.ID)
		if jobImages == nil {
			jobImages = []models.JobImage{}
		}

		imageURLs := make([]string, len(jobImages))
		for i, img := range jobImages {
			imageURLs[i] = img.ImageURL
		}

		jobResponse := map[string]interface{}{
			"id":               job.ID,
			"service_category": job.ServiceCategory,
			"service_specific": job.ServiceSpecific,
			"time":             job.Time,
			"budget":           job.Budget,
			"description":      job.Description,
			"headline":         job.Headline,
			"status":           job.Status,
			"created_at":       job.CreatedAt,
			"street":           jobAddress.Street,
			"city":             jobAddress.City,
			"state":            jobAddress.State,
			"zip":              "",
			"country":          jobAddress.Country,
			"images":           imageURLs,
		}

		jobsResponse = append(jobsResponse, jobResponse)
	}

	if len(jobsResponse) == 0 {
		jobsResponse = []map[string]interface{}{}
		c.JSON(http.StatusOK, gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": int(math.Ceil(float64(total) / float64(limit))),
			"data":        jobsResponse,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"page":        page,
		"limit":       limit,
		"total":       total,
		"total_pages": int(math.Ceil(float64(total) / float64(limit))),
		"data":        jobsResponse,
	})
}

func (h *JobHandler) GetMyJobs(c *gin.Context) {
	userID := c.GetString("userID")

	// Default pagination params
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	jobs, total, err := h.service.GetMyAllJobs(userID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": jobs,
		"meta": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": int(math.Ceil(float64(total) / float64(limit))),
		},
	})
}

func (h *JobHandler) GetMyJobStat(c *gin.Context) {
	userID := c.GetString("userID")
	totalJobs, hired, err := h.service.GetMyJobStat(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"total_jobs": totalJobs, "hired": hired})
}

func (h *JobHandler) GetClientDetailJob(c *gin.Context) {
	jobID := c.Param("job_id")

	email, phone, err := h.service.GetClientDetailJob(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"email": email, "phone": phone})

}
