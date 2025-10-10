package utils

import (
	"context"
	"fmt"
	"log"
	"testing"
	"time"
)

func TestGeocoding(t *testing.T) {
	apiKey := "g5fjfHaWQ6gq3O2wBMn3kCN6IYq7t0BIvfzRF6ZZ6wQ"

	tests := []struct {
		street  string
		city    string
		state   string
		zip     string
		country string
	}{
		{"Invalidenstr 117", "Berlin", "BE", "10115", "Germany"},
		{"1600 Amphitheatre Parkway", "Mountain View", "CA", "94043", "USA"},
		{"10 Downing Street", "London", "", "SW1A 2AA", "UK"},
		{"Eiffel Tower", "Paris", "", "75007", "France"},
	}

	// Loop through and test each address
	for _, t := range tests {
		fmt.Printf("\nTesting address: %s, %s, %s, %s, %s\n", t.street, t.city, t.state, t.zip, t.country)

		_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		lat, lng, err := GeocodeAddress(t.street, t.city, t.state, t.zip, t.country, apiKey)
		if err != nil {
			log.Printf("❌ Failed to geocode: %v\n", err)
			continue
		}

		fmt.Printf("✅ Coordinates: Latitude=%.6f, Longitude=%.6f\n", lat, lng)
	}
}
