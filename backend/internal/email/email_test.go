package email

import (
	"backend/config"
	"fmt"
	"strconv"
	"testing"
)

func TestSendEmail(t *testing.T) {

	server := "smtp.elasticemail.com"
	portStr := "2525"
	username := "mail2@pollsnation.com"
	password := "388EB08DCEA01E1EE385DB2ABB3C398AAD45"
	from := "mail@pollsnation.com"

	port, err := strconv.Atoi(portStr)
	if err != nil {
		port = 587
	}

	if server == "" || username == "" || password == "" || from == "" {
		t.Skip("SMTP credentials not available")
	}

	emailService := NewEmailService(config.SMTPConfig{
		Server:   server,
		Port:     port,
		Username: username,
		Password: password,
		From:     from,
	})

	body := ""

	fmt.Print("sending email...")

	err = emailService.SendHTMLEmail("yohannesnatnael9@gmail.com", "Reset password", body)
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}
