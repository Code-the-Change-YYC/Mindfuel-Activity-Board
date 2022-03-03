package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/model"
)

type Handler struct {
	Client *mongo.Client
}

const errorMessage = "Something went wrong! Please try again."

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	collection := h.Client.Database("wondervilleDev").Collection("users")
	cursor, err := collection.Find(context.TODO(), bson.D{})

  if err != nil {
		log.Println("Error processing GetUsers:", err)
    http.Error(w, errorMessage, http.StatusInternalServerError)
    return
  }

	defer cursor.Close(context.TODO())

	var users []model.User // Store response in this slice
	for cursor.Next(context.TODO()) {
		var user model.User

		if err = cursor.Decode(&user); err != nil {
			log.Printf("Error decoding user %v:\n%s", user, err)
			continue
		}

		users = append(users, user)
	}

	if err = cursor.Err(); err != nil {
		log.Println("Error processing GetUsers:", err)
		http.Error(w, errorMessage, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}
