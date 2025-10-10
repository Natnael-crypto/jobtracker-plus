package middleware

import (
	"backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtToken, err := c.Cookie("session")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		claims, err := utils.ParseJWT(jwtToken, jwtSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		c.Set("userID", claims["user_id"].(string))
		c.Set("role", claims["role"].(string))
		c.Set("email", claims["email"].(string))
		c.Next()
	}
}
