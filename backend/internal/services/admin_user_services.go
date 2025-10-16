package services

import (
	"backend/internal/repositories"
	"errors"
	"fmt"
	"time"
)

type AdminUserService struct {
	repo *repositories.AdminUserRepository
}

func AdminNewUserService(repo *repositories.AdminUserRepository) *AdminUserService {
	return &AdminUserService{repo: repo}
}

func (s *AdminUserService) GetAllUsers(filters map[string]string) ([]repositories.UserDTO, int64, error) {
	var f repositories.UserFilter

	if v, ok := filters["role"]; ok && v != "" {
		f.Role = v
	}
	if v, ok := filters["status"]; ok && v != "" {
		f.Status = v
	}
	if v, ok := filters["search"]; ok && v != "" {
		f.Search = v
	}

	if v, ok := filters["email_verified"]; ok && v != "" {
		val := v == "true"
		f.EmailVerified = &val
	}
	if v, ok := filters["identity_verified"]; ok && v != "" {
		val := v == "true"
		f.IdentityVerified = &val
	}

	if v, ok := filters["created_after"]; ok && v != "" {
		t, err := time.Parse(time.RFC3339, v)
		if err != nil {
			return nil, 0, errors.New("invalid created_after format (expected RFC3339)")
		}
		f.CreatedAfter = &t
	}
	if v, ok := filters["created_before"]; ok && v != "" {
		t, err := time.Parse(time.RFC3339, v)
		if err != nil {
			return nil, 0, errors.New("invalid created_before format (expected RFC3339)")
		}
		f.CreatedBefore = &t
	}

	limit := 20
	offset := 0
	if v, ok := filters["limit"]; ok && v != "" {
		fmt.Sscanf(v, "%d", &limit)
	}
	if v, ok := filters["offset"]; ok && v != "" {
		fmt.Sscanf(v, "%d", &offset)
	}
	f.Limit = limit
	f.Offset = offset

	return s.repo.GetUsers(f)
}

func (s *AdminUserService) GetUserByIDClient(id string) (*repositories.UserDTO, []repositories.JobDTO, error) {
	return s.repo.GetUserByIDClient(id)
}

func (s *AdminUserService) GetUserByIDBusiness(id string) (*repositories.UserDTO, []repositories.JobIntent, error) {
	return s.repo.GetUserByIDBusiness(id)
}
