package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AnonIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		anonID := ""

		if cookie, err := c.Cookie("anno_id"); err == nil && cookie != "" {
			anonID = cookie
		}

		if anonID == "" {
			anonID = uuid.NewString()

			c.SetCookie(
				"anno_id",
				anonID,
				60*60*24*365,
				"/",
				"",
				false,
				false,
			)
		}
		ip := c.ClientIP()
		c.Set("ip", ip)
		c.Set("anno_id", anonID)

		c.Next()
	}
}
