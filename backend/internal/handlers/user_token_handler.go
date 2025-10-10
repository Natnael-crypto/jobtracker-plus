package handlers

import (
	"backend/internal/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserTokenHandler struct {
	service services.UserTokenService
}

func NewUserTokenHandler(service services.UserTokenService) *UserTokenHandler {
	return &UserTokenHandler{service: service}
}

func (h *UserTokenHandler) RequestEmailVerification(c *gin.Context) {
	userID := c.GetString("userID")

	code, err := h.service.GenerateEmailVerification(userID)
	fmt.Print(code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate code"})
		return
	}
	// TODO: send email with code
	c.JSON(http.StatusOK, gin.H{"message": "verification code sent"})
}

func (h *UserTokenHandler) VerifyEmail(c *gin.Context) {
	var req struct {
		Code string `json:"code" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.VerifyEmail(req.Code); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "email verified"})
}

// --- Password Reset ---
func (h *UserTokenHandler) RequestPasswordReset(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	code, err := h.service.GeneratePasswordReset(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate reset code"})
		return
	}
	fmt.Print(code)
	// TODO: send code via email
	c.JSON(http.StatusOK, gin.H{"message": "reset code sent"})
}

func (h *UserTokenHandler) ResetPassword(c *gin.Context) {
	var req struct {
		Email       string `json:"email" binding:"required"`
		Code        string `json:"code" binding:"required"`
		NewPassword string `json:"new_password" binding:"required,min=8"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.ResetPassword(req.Email, req.Code, req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "password updated successfully"})
}
