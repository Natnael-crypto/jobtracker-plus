package emails

import (
	"backend/config"
	"fmt"
	"net/smtp"
	"strings"
	"time"
)

type EmailService struct {
	config config.SMTPConfig
}

func NewEmailService(cfg config.SMTPConfig) *EmailService {
	return &EmailService{config: cfg}
}

func (s *EmailService) SendEmail(to, subject, body string) error {
	auth := smtp.PlainAuth("", s.config.Username, s.config.Password, s.config.Server)

	msg := strings.Join([]string{
		fmt.Sprintf("From: \"Polls Nation\" <%s>", s.config.From),
		fmt.Sprintf("To: %s", to),
		fmt.Sprintf("Subject: %s", subject),
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=UTF-8",
		"",
		body,
	}, "\r\n")

	addr := fmt.Sprintf("%s:%d", s.config.Server, s.config.Port)

	done := make(chan error, 1)
	go func() {
		done <- smtp.SendMail(addr, auth, s.config.From, []string{to}, []byte(msg))
	}()

	select {
	case err := <-done:
		return err
	case <-time.After(10 * time.Second):
		return fmt.Errorf("email send timeout")
	}
}

func (s *EmailService) SendHTMLEmail(to, subject, htmlBody string) error {
	auth := smtp.PlainAuth("", s.config.Username, s.config.Password, s.config.Server)

	msg := strings.Join([]string{
		fmt.Sprintf("From: \"JobTracker+\" <%s>", s.config.From),
		fmt.Sprintf("To: %s", to),
		fmt.Sprintf("Subject: %s", subject),
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=UTF-8",
		"",
		htmlBody,
	}, "\r\n")

	addr := fmt.Sprintf("%s:%d", s.config.Server, s.config.Port)

	done := make(chan error, 1)
	go func() {
		done <- smtp.SendMail(addr, auth, s.config.From, []string{to}, []byte(msg))
	}()

	select {
	case err := <-done:
		return err
	case <-time.After(10 * time.Second):
		return fmt.Errorf("email send timeout")
	}
}
