package handlers

import (
	"backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MessageHandler struct {
	service services.MessageService
}

func NewMessageHandler(service services.MessageService) *MessageHandler {
	return &MessageHandler{service: service}
}

func (h *MessageHandler) CreateMessage(c *gin.Context) {
	userID := c.GetString("userID")
	jobID := c.Param("jobID")

	var req struct {
		Message string `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg, err := h.service.Create(jobID, userID, req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, msg)
}

func (h *MessageHandler) UpdateMessage(c *gin.Context) {
	userID := c.GetString("userID")
	msgID := c.Param("id")

	var req struct {
		Message string `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg, err := h.service.Update(msgID, userID, req.Message)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, msg)
}

func (h *MessageHandler) DeleteMessage(c *gin.Context) {
	userID := c.GetString("userID")
	msgID := c.Param("id")

	if err := h.service.Delete(msgID, userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *MessageHandler) GetConversation(c *gin.Context) {
	userID := c.GetString("userID")
	jobID := c.Param("jobID")

	conversation, err := h.service.GetConversation(jobID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if conversation == nil {
		conversation := []map[string]interface{}{}
		c.JSON(http.StatusOK, conversation)
		return
	}
	c.JSON(http.StatusOK, conversation)
}
