package model

import "time"

type UserFilter struct {
	FromDateTimestamp string    `schema:"fromDate,required"`
	MaxUsers          int       `schema:"maxUsers,required"`
	LngLower          float64   `schema:"mapBounds[lngBounds][lower],required"`
	LngUpper          float64   `schema:"mapBounds[lngBounds][upper],required"`
	LatLower          float64   `schema:"mapBounds[latBounds][lower],required"`
	LatUpper          float64   `schema:"mapBounds[latBounds][upper],required"`
	FromDate          time.Time `schema:"-"` // Used to store converted fromDate, not included in raw query parameters
}

type StatsFilter struct {
	AllTime           bool      `schema:"allTime"` // Whether to return all time stats, if false or not provided need to provide fromDate
	Top               *int      `schema:"top"` // Limit return to the top number of activities
	FromDateTimestamp string    `schema:"fromDate"`
	FromDate          time.Time `schema:"-"` // Used to store converted fromDate, not included in raw query parameters
}

type UsersResponse struct {
	Users  []User `json:"users"`
	Counts Counts `json:"counts"`
}

type Counts struct {
	Sessions  int `json:"sessions"`
	Cities    int `json:"cities"`
	Countries int `json:"countries"`
}

type ActivityStatsResponse struct {
	Stats []ActivityStats `json:"stats"`
}
