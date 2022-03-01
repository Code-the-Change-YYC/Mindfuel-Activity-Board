package server

import (
	"net/http"
	
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	Db *mongo.Client
}

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hit get users!"))
}