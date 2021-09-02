package model

import "time"

/*
 For   "type": "wondervilleAsset",
// TODO do we split the sub-structs?
*/
type WondervilleAsset struct {
	DateTime time.Time
	Ip       string   `json:"ip"`
	Url      string   `json:"url"`
	Location Location `json:"location"`
	Asset    Asset    `json:"asset"`
	Rank     int      `json:"rank"`
}

type Location struct {
	Country string  `json:"country"`
	Region  string  `json:"region_name"`
	City        string  `json:"city"`
	Longitude   float32 `json:"longitude"`
	Latitude    float32 `json:"latitude"`
}

type Asset struct {
	Name     string `json:"name"`
	Url      string `json:"url"`
	Id       int    `json:"id"`
	UUID     string `json:"uuid"`
	Type     string `json:"type"`
	ImageUrl string `json:"imageUrl"`
	Active   bool   `json:"active"`
}
