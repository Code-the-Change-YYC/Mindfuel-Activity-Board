package model

type RawCounts struct {
	Sessions  []CountsValue `bson:"sessions"`
	Cities    []CountsValue `bson:"cities"`
	Countries []CountsValue `bson:"countries"`
}

type CountsValue struct {
	Val int `bson:"count"`
}

type ActivityStats struct {
	Hits     int    `json:"hits" bson:"hits"`
	Name     string `json:"name" bson:"name"`
	Type     string `json:"type" bson:"type"`
	Url      string `json:"url" bson:"url"`
	ImageUrl string `json:"imageUrl" bson:"imageUrl"`
	Rank     int    `json:"rank"`
}

type FilterOption struct {
	Name string `json:"name" json:"type"`
	Type string `json:"type" bson:"type"`
}
