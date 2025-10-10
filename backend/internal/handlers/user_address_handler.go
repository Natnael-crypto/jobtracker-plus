package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserAddressHandler struct {
	Service *services.UserAddressService
}

func NewUserAddressHandler(s *services.UserAddressService) *UserAddressHandler {
	return &UserAddressHandler{Service: s}
}

func (h *UserAddressHandler) GetAddress(c *gin.Context) {
	userID := c.GetString("userID")
	address, err := h.Service.GetAddress(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, address)
}

func (h *UserAddressHandler) UpdateAddress(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Street  string `json:"street"`
		City    string `json:"city"`
		State   string `json:"state"`
		Zip     string `json:"zip"`
		Country string `json:"country"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, err := h.Service.UpdateAddress(userID, req.Street, req.City, req.State, req.Zip, req.Country)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, address)
}
