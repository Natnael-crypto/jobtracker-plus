package handlers

import (
	"backend/internal/services"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserProfileHandler struct {
	Service *services.UserProfileService
}

func NewUserProfileHandler(s *services.UserProfileService) *UserProfileHandler {
	return &UserProfileHandler{Service: s}
}

func (h *UserProfileHandler) GetProfile(c *gin.Context) {
	userID := c.GetString("userID")
	profile, err := h.Service.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	profile.ID = c.GetString("email")
	c.JSON(http.StatusOK, profile)
}

func (h *UserProfileHandler) UpdateProfile(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Phone     string `json:"phone_number"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	profile, err := h.Service.UpdateProfile(userID, req.FirstName, req.LastName, req.Phone)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (h *UserProfileHandler) UploadProfileImage(c *gin.Context) {
	userID := c.GetString("userID")
	fileHeader, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image is required"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer file.Close()

	profile, err := h.Service.UploadProfileImage(context.Background(), userID, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (h *UserProfileHandler) GetUserProfile(c *gin.Context) {
	userID := c.Param("user_id")

	data, err := h.Service.GetUserProfileData(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user profile"})
		return
	}

	if data.UserProfile == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user profile not found"})
		return
	}

	c.JSON(http.StatusOK, data)
}
