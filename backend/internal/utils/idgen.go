package utils

import (
	"fmt"
	"math/rand"
	"time"
)

func GenerateFriendlyID(prefix string, length int) string {
	rand.Seed(time.Now().UnixNano())
	id := ""
	for i := 0; i < length; i++ {
		id += fmt.Sprintf("%d", rand.Intn(10))
	}

	datePart := time.Now().Format("20060102")
	return fmt.Sprintf("%s-%s-%s", prefix, datePart, id)
}
