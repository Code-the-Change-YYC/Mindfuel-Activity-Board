package model

type RawCounts struct {
	Sessions  []CountsValue `bson:"sessions"`
	Cities    []CountsValue `bson:"cities"`
	Countries []CountsValue `bson:"countries"`
}

type CountsValue struct {
	Val int `bson:"count"`
}
