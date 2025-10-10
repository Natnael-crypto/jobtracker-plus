package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"time"
)

type HereGeoResponse struct {
	Items []struct {
		Title    string `json:"title"`
		ID       string `json:"id"`
		Position struct {
			Lat float64 `json:"lat"`
			Lng float64 `json:"lng"`
		} `json:"position"`
	} `json:"items"`
}

var httpClient = &http.Client{
	Timeout: 10 * time.Second,
	Transport: &http.Transport{
		MaxIdleConns:       100,
		IdleConnTimeout:    90 * time.Second,
		DisableCompression: false,
		DialContext: (&net.Dialer{
			Timeout:   5 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
	},
}

func GeocodeAddress(street, city, state, zip, country, apiKey string) (float64, float64, error) {
	address := fmt.Sprintf("%s, %s, %s, %s, %s", street, city, state, zip, country)

	endpoint := "https://geocode.search.hereapi.com/v1/geocode"
	reqURL, err := url.Parse(endpoint)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to parse endpoint: %w", err)
	}

	query := reqURL.Query()
	query.Set("q", address)
	query.Set("apiKey", apiKey)
	reqURL.RawQuery = query.Encode()

	ctx := context.Background()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL.String(), nil)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return 0, 0, fmt.Errorf("geocoding request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, 0, fmt.Errorf("geocoding failed with status: %s", resp.Status)
	}

	var geoResp HereGeoResponse
	if err := json.NewDecoder(resp.Body).Decode(&geoResp); err != nil {
		return 0, 0, fmt.Errorf("failed to decode response: %w", err)
	}

	if len(geoResp.Items) == 0 {
		return 0, 0, fmt.Errorf("no geocoding results for address: %s", address)
	}

	lat := geoResp.Items[0].Position.Lat
	lng := geoResp.Items[0].Position.Lng
	return lat, lng, nil
}
