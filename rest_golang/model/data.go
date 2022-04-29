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
	Hits     int    `bson:"hits"`
	Name     string `bson:"name"`
	Type     string `bson:"type"`
	Url      string `bson:"url"`
	ImageUrl string `bson:"imageUrl"`
}
