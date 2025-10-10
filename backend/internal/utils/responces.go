package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type StandardResponse struct {
	Success bool        `json:"success"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func Respond(c *gin.Context, statusCode int, success bool, message string, data interface{}, err string) {
	c.JSON(statusCode, StandardResponse{
		Success: success,
		Error:   err,
		Message: message,
		Data:    data,
	})
}

func RespondSuccess(c *gin.Context, message string, data interface{}) {
	Respond(c, http.StatusOK, true, message, data, "")
}

func RespondError(c *gin.Context, statusCode int, message string, err string) {
	Respond(c, statusCode, false, message, nil, err)
}
