package handlers

import (
	"backend/internal/services"
	"bytes"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type PortfolioHandler struct {
	service services.PortfolioService
}

func NewPortfolioHandler(service services.PortfolioService) *PortfolioHandler {
	return &PortfolioHandler{service: service}
}

func (h *PortfolioHandler) UploadPortfolioImage(c *gin.Context) {
	userID := c.GetString("userID")

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot open file"})
		return
	}
	defer src.Close()

	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot read file"})
		return
	}

	ext := file.Filename[strings.LastIndex(file.Filename, ".")+1:]
	image, err := h.service.UploadPortfolioImage(c.Request.Context(), userID, buf, file.Header.Get("Content-Type"), ext)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	c.JSON(http.StatusCreated, image)
}

func (h *PortfolioHandler) DeletePortfolioImage(c *gin.Context) {
	userID := c.GetString("userID")
	portfolioID := c.Param("portfolio_id")

	if err := h.service.DeletePortfolioImage(userID, portfolioID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "portfolio image deleted"})
}

func (h *PortfolioHandler) GetUserPortfolio(c *gin.Context) {
	userID := c.Param("user_id")

	urls, err := h.service.GetUserPortfolio(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	if urls == nil {
		c.JSON(http.StatusOK, gin.H{"images": []string{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"images": urls})
}

func (h *PortfolioHandler) GetMyUserPortfolio(c *gin.Context) {
	userID := c.GetString("userID")

	urls, err := h.service.GetUserPortfolio(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}
	if urls == nil {
		c.JSON(http.StatusOK, gin.H{"images": []string{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"images": urls})
}
