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
	role := c.GetString("role")

	var req struct {
		Message string `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	msg, err := h.service.Create(jobID, userID, req.Message, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
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
		c.JSON(http.StatusBadRequest, gin.H{"error":  ""})
		return
	}

	msg, err := h.service.Update(msgID, userID, req.Message)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error":  ""})
		return
	}
	c.JSON(http.StatusOK, msg)
}

func (h *MessageHandler) DeleteMessage(c *gin.Context) {
	userID := c.GetString("userID")
	msgID := c.Param("id")

	if err := h.service.Delete(msgID, userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error":  ""})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *MessageHandler) GetConversation(c *gin.Context) {
	userID := c.GetString("userID")
	jobID := c.Param("jobID")
	role := c.GetString("role")

	conversation, err := h.service.GetConversation(jobID, userID, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":  ""})
		return
	}
	if conversation == nil {
		conversation := []map[string]interface{}{}
		c.JSON(http.StatusOK, conversation)
		return
	}
	c.JSON(http.StatusOK, conversation)
}
