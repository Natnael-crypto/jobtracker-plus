package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AdminUserHandler struct {
	service *services.AdminUserService
}

func NewAdminUserHandler(service *services.AdminUserService) *AdminUserHandler {
	return &AdminUserHandler{service: service}
}

// GET /api/users?role=client&status=active&email_verified=true&search=john
func (h *AdminUserHandler) GetUsers(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	filters := map[string]string{
		"role":              c.Query("role"),
		"status":            c.Query("status"),
		"search":            c.Query("search"),
		"email_verified":    c.Query("email_verified"),
		"identity_verified": c.Query("identity_verified"),
		"created_after":     c.Query("created_after"),
		"created_before":    c.Query("created_before"),
		"limit":             c.Query("limit"),
		"offset":            c.Query("offset"),
	}

	users, total, err := h.service.GetAllUsers(filters)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total": total,
		"data":  users,
	})
}

func (h *AdminUserHandler) GetUserByIDClient(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param("id")
	user, jobs, err := h.service.GetUserByIDClient(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
		"jobs": jobs,
	})
}

func (h *AdminUserHandler) GetUserByIDBusiness(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	id := c.Param("id")
	user, jobs, err := h.service.GetUserByIDBusiness(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user": user,
		"jobs": jobs,
	})
}
