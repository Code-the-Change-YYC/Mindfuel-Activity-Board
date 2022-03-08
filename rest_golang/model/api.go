package model

import "time"

type UserFilter struct {
	FromDateTimestamp string    `schema:"fromDate,required"`
	LngLower          float64   `schema:"mapBounds[lngBounds][lower],required"`
	LngUpper          float64   `schema:"mapBounds[lngBounds][upper],required"`
	LatLower          float64   `schema:"mapBounds[latBounds][lower],required"`
	LatUpper          float64   `schema:"mapBounds[latBounds][upper],required"`
	FromDate          time.Time `schema:"-"` // Used to store parsed fromDate, not included in raw query parameters
}

type UsersResponse struct {
	Users []User
	Counts map[string]int
}