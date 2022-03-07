package model

import "time"

const (
	WondervilleAsset   = "wondervilleAsset"
	WondervilleSession = "wondervilleSession"
)

type User struct {
	Type    string    `json:"type" bson:"type"`
	Payload payload   `json:"payload" bson:"payload"`
	Date    time.Time `json:"date" bson:"date"`
}

type payload struct {
	Ip       *string  `json:"ip,omitempty" bson:"ip,omitempty"`
	Url      *string  `json:"url,omitempty" bson:"url,omitempty"`
	Location location `json:"location" bson:"location"`
	Asset    *asset   `json:"asset,omitempty" bson:"asset,omitempty"`
	Rank     *int     `json:"rank,omitempty" bson:"rank,omitempty"`
	// Stats    *Stats   `json:"stats,omitempty" bson:"stats,omitempty"` // Omit stats for now
}

type stats struct {
	Top     topStats   `json:"stats" bson:"stats"`
	Summary []statType `json:"statsSummary" bson:"statsSummary"`
}

type topStats struct {
	Game     statType `json:"Game" bson:"Game"`
	Video    statType `json:"Video" bson:"Video"`
	Activity statType `json:"Activity" bson:"Activity"`
	Story    statType `json:"Story" bson:"Story"`
}

type statType struct {
	Type   string `json:"type" bson:"type"`
	Hits   int    `json:"hits" bson:"hits"`
	Top    string `json:"top" bson:"top"`
	TopUrl string `json:"topUrl" bson:"topUrl"`
	Rank   int    `json:"rank" bson:"rank"`
}

type location struct {
	Country   string  `json:"country_name" bson:"country_name"`
	Region    string  `json:"region_name" bson:"region_name"`
	City      string  `json:"city" bson:"city"`
	Longitude float32 `json:"longitude" bson:"longitude"`
	Latitude  float32 `json:"latitude" bson:"latitude"`
}

type asset struct {
	Name     string `json:"name" bson:"name"`
	Url      string `json:"url" bson:"url"`
	Id       int    `json:"id" bson:"id"`
	UUID     string `json:"uuid" bson:"uuid"`
	Type     string `json:"type" bson:"type"`
	ImageUrl string `json:"imageUrl" bson:"imageUrl"`
	Active   bool   `json:"active" bson:"active"`
}
