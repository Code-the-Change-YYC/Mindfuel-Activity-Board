package server

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/schema"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/db"
	"mindfuel.ca/activity_rest/logger"
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

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	filter, err := GetUserQueryParams(r.URL.Query())
	if err != nil {
		logger.Error.Println("Error decoding query parameters:", err)
		http.Error(w, errorQueryParams, http.StatusInternalServerError)
		return
	}

	users, err := db.GetUsers(h.Client, filter)
	if err != nil {
		logger.Error.Println("Error processing GetUsers:", err)
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	} else if len(users) == 0 {
		users = []model.User{}
	}

	rawCounts, err := db.GetCounts(h.Client, filter)
	if err != nil {
		logger.Error.Println("Error processing GetCounts:", err)
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

func (h *Handler) GetActivityStats(w http.ResponseWriter, r *http.Request) {
	filter, err := GetStatsQueryParams(r.URL.Query())
	if err != nil {
		logger.Error.Println("Error decoding query parameters:", err)
		http.Error(w, errorQueryParams, http.StatusInternalServerError)
		return
	}

	activityStats, err := db.GetActivityStats(h.Client, filter)
	if err != nil {
		logger.Error.Println("Error processing GetActivityStats:", err)
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	} else if len(activityStats) == 0 {
		activityStats = []model.ActivityStats{}
	}

	resp := model.ActivityStatsResponse{
		Stats: activityStats,
	}

	json.NewEncoder(w).Encode(resp)
}

func (h *Handler) GetUserFilterOptions(w http.ResponseWriter, r *http.Request) {
	filterOptions, err := db.GetFilterOptions(h.Client)
	if err != nil {
		logger.Error.Println("Error processing GetUserFilterOptions:", err)
		http.Error(w, errorGeneric, http.StatusInternalServerError)
		return
	}

	resp := model.FilterOptionsResponse{
		Options: filterOptions,
	}

	json.NewEncoder(w).Encode(resp)
}
