package handlers

import (
	"backend/internal/repositories"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type ProviderHandler struct {
	repo *repositories.ProviderRepository
}

func NewProviderHandler(repo *repositories.ProviderRepository) *ProviderHandler {
	return &ProviderHandler{repo: repo}
}

func (h *ProviderHandler) ListProviders(c *gin.Context) {
	var filter repositories.ProviderFilter

	// --- Parse Services filter ---
	if s := c.Query("services"); s != "" {
		parts := strings.Split(s, ",")
		trimmed := make([]string, 0, len(parts))
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p != "" {
				trimmed = append(trimmed, p)
			}
		}
		filter.Services = trimmed
	}

	// --- Parse location filters ---
	if city := strings.TrimSpace(c.Query("city")); city != "" {
		filter.City = &city
	}
	if state := strings.TrimSpace(c.Query("state")); state != "" {
		filter.State = &state
	}
	if country := strings.TrimSpace(c.Query("country")); country != "" {
		filter.Country = &country
	}

	// --- Parse search query (first_name / last_name) ---
	if search := strings.TrimSpace(c.Query("search")); search != "" {
		filter.Search = &search
	}

	// --- Parse minimum rating ---
	if mr := c.Query("min_rating"); mr != "" {
		if v, err := strconv.ParseFloat(mr, 64); err == nil {
			filter.MinRating = &v
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid min_rating"})
			return
		}
	}

	// --- Pagination ---
	limit := 20
	if l := c.Query("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = v
		}
	}
	offset := 0
	if o := c.Query("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil && v >= 0 {
			offset = v
		}
	}
	filter.Limit = limit
	filter.Offset = offset

	// --- Fetch data ---
	results, err := h.repo.GetProviders(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load providers"})
		return
	}

	// --- Return response ---
	c.JSON(http.StatusOK, gin.H{
		"data":        results,
		"total_count": len(results),
		"limit":       limit,
		"offset":      offset,
	})
}

func (h *ProviderHandler) GetProvider(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}
	detail, err := h.repo.GetByUserID(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load provider details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": detail})
}
