package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/schema"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/db"
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
	filter, err := GetQueryParams(r.URL.Query())
	if err != nil {
		log.Println("Error decoding query parameters:", err)
		http.Error(w, errorQueryParams, http.StatusInternalServerError)
		return
	}

	users, err := db.GetUsers(h.Client, filter)
	if err != nil {
		log.Println("Error processing GetUsers:", err)
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	}

	rawCounts, err := db.GetCounts(h.Client, filter)
	if err != nil {
		log.Println("Error processing GetCounts:", err)
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	}

	resp := model.UsersResponse{
		Users: users,
		Counts: model.Counts{
			Sessions:  GetCountOrZero(rawCounts.Sessions),
			Countries: GetCountOrZero(rawCounts.Countries),
			Cities:    GetCountOrZero(rawCounts.Cities),
		},
	}

	json.NewEncoder(w).Encode(resp)
}
