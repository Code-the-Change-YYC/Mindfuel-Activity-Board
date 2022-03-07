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

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	var filter model.UserFilter
	err := getQueryParams(filter, r.URL.Query())
	if err != nil {
		log.Println("Error decoding query parameters:", err)
		http.Error(w, errorQueryParams, http.StatusInternalServerError)
		return
	}

	collection := h.Client.Database("wondervilleDev").Collection("users")
	query := []bson.M{
		{"date": bson.M{"$gt": filter.FromDate}},
		{"payload.location.latitude": bson.M{"$gte": filter.LatLower, "$lte": filter.LatUpper}},
	}

	if filter.LngLower <= filter.LngUpper {
		query = append(query, bson.M{"payload.location.longitude": bson.M{"$gte": filter.LngLower, "$lte": filter.LngUpper}})
	} else {
		latQuery := []bson.M{
			{"payload.location.longitude": bson.M{"$gte": filter.LngLower, "$lte": 180}},
			{"payload.location.longitude": bson.M{"$gte": -180, "$lte": filter.LngUpper}},
		}
		query = append(query, bson.M{"$or": latQuery})
	}

	cursor, err := collection.Find(context.TODO(), query)

	if err != nil {
		log.Println("Error processing GetUsers:", err)
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

	resp := &model.UsersResponse {

	}
	log.Println(resp)

	json.NewEncoder(w).Encode(users)
}

func getQueryParams(filter model.UserFilter, params url.Values) error {
	if err := decoder.Decode(&filter, params); err != nil {
		return err
	}

	fromDate, err := time.Parse(time.RFC3339, params.Get("fromDate"))
	if err != nil {
		return err
	}
	filter.FromDate = fromDate

	return nil
}
