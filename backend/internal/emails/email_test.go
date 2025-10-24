package emails

import (
	"backend/config"
	"fmt"
	"strconv"
	"testing"
)

func TestSendEmail(t *testing.T) {

	server := "smtp.elasticemail.com"
	portStr := "2525"
	username := "mail@jobtrackplus.com"
	password := "DD4322C4E402A1DE9C6B959F0EC1C54DF6E3"
	from := "noreply@jobtrackplus.com"

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

	body := GenerateHiredEmail("Natnael", "Software Engineer", "London", "http://JSIWOD")

	fmt.Print("sending email...")

	err = emailService.SendHTMLEmail("yohannesnatnael9@gmail.com", "You’ve Successfully Hired for Your Job", body)
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}
