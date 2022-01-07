package model

type AssetMessage struct {
	Type    string       `json:"type"`
	Payload AssetPayload `json:"payload"`
}

type SessionMessage struct {
	Type    string         `json:"type"`
	Payload SessionPayload `json:"payload"`
}

type AssetPayload struct {
	Ip       string   `json:"ip"`
	Url      string   `json:"url"`
	Location Location `json:"location"`
	Asset    Asset    `json:"asset"`
	Stats    Stats    `json:"stats"`
	Rank     int      `json:"rank"`
}

type SessionPayload struct {
	Location Location `json:"location"`
}

type Stats struct {
	Top     TopStats   `json:"stats"`
	Summary []StatType `json:"statsSummary"`
}

type TopStats struct {
	Game     StatType `json:"Game"`
	Video    StatType `json:"Video"`
	Activity StatType `json:"Activity"`
	Story    StatType `json:"Story"`
}

type StatType struct {
	Type   string `json:"type"`
	Hits   int    `json:"hits"`
	Top    string `json:"top"`
	TopUrl string `json:"topUrl"`
	Rank   int    `json:"rank"`
}

type Location struct {
	Country   string  `json:"country_name"`
	Region    string  `json:"region_name"`
	City      string  `json:"city"`
	Longitude float32 `json:"longitude"`
	Latitude  float32 `json:"latitude"`
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
