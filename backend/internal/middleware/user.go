package middleware

import (
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

func GetUserID(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtToken, err := c.Cookie("session")
		if err != nil {
			c.Next()
		}

		claims, err := utils.ParseJWT(jwtToken, jwtSecret)
		if err != nil {
			c.Next()
		}

		c.Set("userID", claims["user_id"].(string))
		c.Set("role", claims["role"].(string))
		c.Set("email", claims["email"].(string))
		c.Next()
	}
}
