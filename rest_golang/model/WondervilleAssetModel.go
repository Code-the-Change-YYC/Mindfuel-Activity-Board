package model

import "time"

type AssetMessage struct {
	Type    string       `bson:"type"`
	Payload AssetPayload `bson:"payload"`
	Date    time.Time    `bson:"date"`
}

type SessionMessage struct {
	Type    string         `bson:"type"`
	Payload SessionPayload `bson:"payload"`
	Date    time.Time      `bson:"date"`
}

type AssetPayload struct {
	Ip       string   `bson:"ip"`
	Url      string   `bson:"url"`
	Location Location `bson:"location"`
	Asset    Asset    `bson:"asset"`
	Stats    Stats    `bson:"stats"`
	Rank     int      `bson:"rank"`
}

type SessionPayload struct {
	Location Location `bson:"location"`
}

type Stats struct {
	Top     TopStats   `bson:"stats"`
	Summary []StatType `bson:"statsSummary"`
}

type TopStats struct {
	Game     StatType `bson:"Game"`
	Video    StatType `bson:"Video"`
	Activity StatType `bson:"Activity"`
	Story    StatType `bson:"Story"`
}

type StatType struct {
	Type   string `bson:"type"`
	Hits   int    `bson:"hits"`
	Top    string `bson:"top"`
	TopUrl string `bson:"topUrl"`
	Rank   int    `bson:"rank"`
}

type Location struct {
	Country   string  `bson:"country_name"`
	Region    string  `bson:"region_name"`
	City      string  `bson:"city"`
	Longitude float32 `bson:"longitude"`
	Latitude  float32 `bson:"latitude"`
}

type Asset struct {
	Name     string `bson:"name"`
	Url      string `bson:"url"`
	Id       int    `bson:"id"`
	UUID     string `bson:"uuid"`
	Type     string `bson:"type"`
	ImageUrl string `bson:"imageUrl"`
	Active   bool   `bson:"active"`
}
