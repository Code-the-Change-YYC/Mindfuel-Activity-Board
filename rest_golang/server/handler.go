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
		"date": bson.M{"$gt": filter.FromDate},
		"payload.location.latitude": bson.M{"$gte": filter.LatLower, "$lte": filter.LatUpper},
	}

	if filter.LngLower <= filter.LngUpper {
		matchQuery["payload.location.longitude"] = bson.M{"$gte": filter.LngLower, "$lte": filter.LngUpper}
	} else {
		lngQuery := []bson.M{
			{"payload.location.longitude": bson.M{"$gte": filter.LngLower, "$lte": 180}},
			{"payload.location.longitude": bson.M{"$gte": -180, "$lte": filter.LngUpper}},
		}
		matchQuery["$or"] = lngQuery
	}

	// Randomly sample users from collection
	matchStage := bson.D{{Key: "$match", Value: matchQuery}}
	sampleStage := bson.D{{Key: "$sample", Value: bson.D{{Key: "size", Value: maxUsers}}}}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, sampleStage})
	log.Println(matchQuery)
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

	// resp := &model.UsersResponse {
	// 	Users: users,
	// }
	json.NewEncoder(w).Encode(users)
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
