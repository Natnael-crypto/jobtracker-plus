package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/utils"

	"github.com/google/uuid"
)

type UserAddressService struct {
	Repo     *repositories.UserAddressRepository
	userRepo *repositories.UserProfileRepository
	APIKey   string
}

func NewUserAddressService(repo *repositories.UserAddressRepository, userRepo *repositories.UserProfileRepository, apiKey string) *UserAddressService {
	return &UserAddressService{
		Repo:     repo,
		userRepo: userRepo,
		APIKey:   apiKey,
	}
}

func (s *UserAddressService) GetAddress(userID string) (*models.UserAddress, error) {
	address, err := s.Repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	return address, nil
}

func (s *UserAddressService) CreateAddress(userID, street, city, state, zip, country string) (*models.UserAddress, error) {
	lat, lng, err := utils.GeocodeAddress(street, city, state, zip, country, s.APIKey)
	if err != nil {
		return nil, err
	}

	address := &models.UserAddress{
		ID:        uuid.NewString(),
		UserID:    userID,
		Street:    street,
		City:      city,
		State:     state,
		Zip:       zip,
		Country:   country,
		Latitude:  lat,
		Longitude: lng,
	}

	if err := s.Repo.Create(address); err != nil {
		return nil, err
	}

	return address, nil
}

func (s *UserAddressService) UpdateAddress(userID, street, city, state, zip, country string) (*models.UserAddress, error) {
	address, err := s.Repo.GetByUserID(userID)
	if err != nil {
		address, _ := s.CreateAddress(userID, street, city, state, zip, country)
		user, err := s.userRepo.GetByUserID(userID)
		if err != nil {
			return nil, err
		}
		user.AddressID = &address.ID
		if err := s.userRepo.Update(user); err != nil {
			return address, nil
		}
		return address, nil
	}

	if street != "" {
		address.Street = street
	}
	if city != "" {
		address.City = city
	}
	if state != "" {
		address.State = state
	}
	if zip != "" {
		address.Zip = zip
	}
	if country != "" {
		address.Country = country
	}

	lat, lng, err := utils.GeocodeAddress(address.Street, address.City, address.State, address.Zip, address.Country, s.APIKey)
	if err != nil {
		return nil, err
	}
	address.Latitude = lat
	address.Longitude = lng

	if err := s.Repo.Update(address); err != nil {
		return nil, err
	}

	return address, nil
}
