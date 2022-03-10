package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/gorilla/schema"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/model"
)

type Handler struct {
	Client *mongo.Client
}

type Counts struct {
	Sessions  []value `bson:"sessions"`
	Cities    []value `bson:"cities"`
	Countries []value `bson:"countries"`
}

type value struct {
	Val int `bson:"count"`
}

// Decoder for query parameters
var decoder = schema.NewDecoder()

const (
	errorGeneric     = "Something went wrong! Please try again."
	errorQueryParams = "Error decoding query parameters."
)

// Maximum number of users to return in a single API call
const maxUsers = 125

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	filter, err := getQueryParams(r.URL.Query())
	if err != nil {
		log.Println("Error decoding query parameters:", err)
		http.Error(w, errorQueryParams, http.StatusInternalServerError)
		return
	}

	collection := h.Client.Database("wondervilleDev").Collection("users")
	matchQuery := bson.M{
		"date":                      bson.M{"$gt": filter.FromDate},
		"payload.location.latitude": bson.M{"$gte": filter.LatLower, "$lte": filter.LatUpper},
	}

	if filter.LngLower <= filter.LngUpper {
		matchQuery["payload.location.longitude"] = bson.M{"$gte": filter.LngLower, "$lte": filter.LngUpper}
	} else {
		// We need to account for longitude ranges which cross the start/end bounds of -180 and 180
		lngQuery := []bson.M{
			{"payload.location.longitude": bson.M{"$gte": filter.LngLower, "$lte": 180}},
			{"payload.location.longitude": bson.M{"$gte": -180, "$lte": filter.LngUpper}},
		}
		matchQuery["$or"] = lngQuery
	}

	// Randomly sample a set number of users from collection
	matchStage := bson.D{{Key: "$match", Value: matchQuery}}
	sampleStage := bson.D{{Key: "$sample", Value: bson.D{{Key: "size", Value: maxUsers}}}}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, sampleStage})
	if err != nil {
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	}

	defer cursor.Close(context.TODO())

	var users []model.User // Store response in this slice
	if err = cursor.All(context.TODO(), &users); err != nil {
		log.Println("Error processing GetUsers:", err)
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	}
	if users == nil {
		users = make([]model.User, 0)
	}

	usersQuery := bson.A{bson.D{{Key: "$count", Value: "count"}}}
	distinctCountriesQuery := bson.A{
		bson.D{{Key: "$match", Value: bson.D{{Key: "payload.location.country_name", Value: bson.D{{Key: "$ne", Value: ""}}}}}},
		bson.D{{Key: "$group", Value: bson.D{{Key: "_id", Value: nil}, {Key: "countries", Value: bson.D{{Key: "$addToSet", Value: "$payload.location.country_name"}}}}}},
		bson.D{{Key: "$unwind", Value: "$countries"}},
		bson.D{{Key: "$group", Value: bson.D{{Key: "_id", Value: nil}, {Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}}}}},
		bson.D{{Key: "$project", Value: bson.D{{Key: "_id", Value: 0}, {Key: "count", Value: 1}}}},
	}
	distinctCitiesQuery := bson.A{
		bson.D{{Key: "$match", Value: bson.D{{Key: "payload.location.city", Value: bson.D{{Key: "$ne", Value: ""}}}}}},
		bson.D{{Key: "$group", Value: bson.D{{Key: "_id", Value: nil}, {Key: "cities", Value: bson.D{{Key: "$addToSet", Value: "$payload.location.city"}}}}}},
		bson.D{{Key: "$unwind", Value: "$cities"}},
		bson.D{{Key: "$group", Value: bson.D{{Key: "_id", Value: nil}, {Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}}}}},
		bson.D{{Key: "$project", Value: bson.D{{Key: "_id", Value: 0}, {Key: "count", Value: 1}}}},
	}

	facetStage := bson.D{{Key: "$facet", Value: bson.D{{Key: "sessions", Value: usersQuery}, {Key: "countries", Value: distinctCountriesQuery}, {Key: "cities", Value: distinctCitiesQuery}}}}
	cursor, err = collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, facetStage})
	if err != nil {
		log.Println("Error processing GetUsers:", err)
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	}
	var result []Counts
	if err = cursor.All(context.TODO(), &result); err != nil {
		log.Println(err)
	}

	counts := result[0]

	resp := model.UsersResponse{
		Users: users,
		Counts: model.Count{
			Sessions:  getCountOrZero(counts.Sessions),
			Countries: getCountOrZero(counts.Countries),
			Cities:    getCountOrZero(counts.Cities),
		},
	}

	json.NewEncoder(w).Encode(resp)
}

func getQueryParams(params url.Values) (model.UserFilter, error) {
	var filter model.UserFilter
	if err := decoder.Decode(&filter, params); err != nil {
		return filter, err
	}

	fromDate, err := time.Parse(time.RFC3339, params.Get("fromDate"))
	if err != nil {
		return filter, err
	}
	filter.FromDate = fromDate

	return filter, nil
}

func getCountOrZero(counts []value) int {
	if len(counts) > 0 {
		return counts[0].Val
	}

	return 0
}
