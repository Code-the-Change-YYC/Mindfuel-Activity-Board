package model

import "time"

// Valid Filter By values
const (
	CategoryFilter     = "Category"
	ActivityTypeFilter = "ActivityType"
)

type UserFilter struct {
	StartDateTimestamp string    `schema:"startDate,required"`
	MaxUsers           int       `schema:"maxUsers,required"`
	LngLower           float64   `schema:"mapBounds[lng][lower],required"`
	LngUpper           float64   `schema:"mapBounds[lng][upper],required"`
	LatLower           float64   `schema:"mapBounds[lat][lower],required"`
	LatUpper           float64   `schema:"mapBounds[lat][upper],required"`
	FilterValue        *string   `schema:"filter[value],omitempty"`
	FilterField        *string   `schema:"filter[field],omitempty"`
	StartDate          time.Time `schema:"-"` // Used to store converted startDate, not included in raw query parameters
}

type StatsFilter struct {
	Top                *int      `schema:"top"` // Limit return to the top number of activities
	StartDateTimestamp *string   `schema:"startDate,omitempty"`
	StartDate          time.Time `schema:"-"` // Used to store converted startDate, not included in raw query parameters
	EndDateTimestamp   *string   `schema:"endDate,omitempty"`
	EndDate            time.Time `schema:"-"` // Used to store converted EndDate, not included in raw query parameters
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

type FilterOptionsResponse struct {
	Options []FilterOption `json:"options"`
}
