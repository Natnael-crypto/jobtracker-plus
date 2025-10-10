package handlers

import (
	"backend/internal/services"
	"backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Service     *services.UserService
	frontendURL string
}

func NewUserHandler(s *services.UserService, frontendURL string) *UserHandler {
	return &UserHandler{Service: s, frontendURL: frontendURL}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		Role        string `json:"role"`
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		PhoneNumber string `json:"phone_number"`
	}
	red := c.Query("redirect")
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "invalid request", err.Error())
		return
	}

	_, err := h.Service.Register(req.Email, req.Password, req.Role, req.FirstName, req.LastName, req.PhoneNumber)
	if err != nil {
		utils.RespondError(c, http.StatusUnauthorized, "unable to register user", err.Error())
		return
	}

	token, err := h.Service.Login(req.Email, req.Password)
	if err != nil {
		utils.RespondError(c, http.StatusUnauthorized, "invalid credentials", err.Error())
		return
	}

	c.SetCookie(
		"session",
		token,
		3600*24,
		"/",
		h.frontendURL,
		false,
		false,
	)
	redirect := map[string]string{
		"redirect": red,
	}

	utils.RespondSuccess(c, "registered", redirect)

}

func (h *UserHandler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	red := c.Query("redirect")
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "invalid request", err.Error())
		return
	}

	token, err := h.Service.Login(req.Email, req.Password)
	if err != nil {
		utils.RespondError(c, http.StatusUnauthorized, "invalid credentials", err.Error())
		return
	}

	c.SetCookie(
		"session",
		token,
		3600*24,
		"/",
		h.frontendURL,
		false,
		false,
	)

	redirect := map[string]string{
		"redirect": red,
	}
	utils.RespondSuccess(c, "logged in", redirect)
}

func (h *UserHandler) CheckEmail(c *gin.Context) {
	email := c.Query("email")
	if email == "" {
		utils.RespondError(c, http.StatusBadRequest, "email is required", "email is required")
		return
	}

	exists, err := h.Service.CheckEmailExists(email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if exists {
		c.JSON(http.StatusOK, gin.H{"exists": true})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": false})
}

func (h *UserHandler) Logout(c *gin.Context) {
	c.SetCookie(
		"session",
		"",
		3600*24,
		"/",
		h.frontendURL,
		false,
		false,
	)

	utils.RespondSuccess(c, "logged out", nil)
}

func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "invalid request", err.Error())
		return
	}

	if err := h.Service.ChangePassword(userID, req.OldPassword, req.NewPassword); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "unable to change password", err.Error())
		return
	}

	utils.RespondSuccess(c, "password changed", nil)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "invalid request", err.Error())
		return
	}

	if err := h.Service.DeleteUser(userID, req.Password); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "unable to delete user", err.Error())
		return
	}

	utils.RespondSuccess(c, "user deleted", nil)
}

func (h *UserHandler) BlockUser(c *gin.Context) {
	adminID := c.GetString("userID")
	targetID := c.Param("id")

	if err := h.Service.BlockUser(adminID, targetID); err != nil {
		utils.RespondError(c, http.StatusForbidden, "unable to block user", err.Error())
		return
	}

	utils.RespondSuccess(c, "user blocked", nil)
}

func (h *UserHandler) UserDetail(c *gin.Context) {
	userID := c.GetString("userID")
	user, err := h.Service.FindByID(userID)
	if err != nil {
		utils.RespondError(c, http.StatusNotFound, "user not found", err.Error())
		return
	}
	user.PasswordHash = ""

	utils.RespondSuccess(c, "user found", user)
}

func (h *UserHandler) UnBlockUser(c *gin.Context) {
	adminID := c.GetString("userID")
	targetID := c.Param("id")
	err := h.Service.UnBlockUser(adminID, targetID)
	if err != nil {
		utils.RespondError(c, http.StatusForbidden, "unable to unblock user", err.Error())
		return
	}

	utils.RespondSuccess(c, "user unblocked", nil)
}

func (h *UserHandler) Verified(c *gin.Context) {
	userID := c.GetString("userID")
	verified, err := h.Service.Verified(userID)
	if err != nil {
		utils.RespondError(c, http.StatusForbidden, "unable to verify user", err.Error())
		return
	}
	utils.RespondSuccess(c, "user verified", verified)
}
