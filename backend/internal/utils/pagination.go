package utils

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	DefaultPage  = 1
	DefaultLimit = 20
	MaxLimit     = 100
)

type Pagination struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"total_pages"`
}

func ParsePagination(c *gin.Context) (page, limit int) {
	p := DefaultPage
	l := DefaultLimit

	if v := c.Query("page"); v != "" {
		if pi, err := strconv.Atoi(v); err == nil && pi > 0 {
			p = pi
		}
	}
	if v := c.Query("limit"); v != "" {
		if li, err := strconv.Atoi(v); err == nil && li > 0 {
			if li > MaxLimit {
				li = MaxLimit
			}
			l = li
		}
	}
	return p, l
}

func WritePaginatedResponse(c *gin.Context, data interface{}, page, limit, total int) {
	totalPages := 0
	if total > 0 {
		totalPages = int(math.Ceil(float64(total) / float64(limit)))
	}
	c.JSON(http.StatusOK, gin.H{
		"data": data,
		"pagination": Pagination{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func BindAndValidate(c *gin.Context, obj interface{}) error {
	if err := c.ShouldBindJSON(obj); err != nil {
		return err
	}
	return nil
}
