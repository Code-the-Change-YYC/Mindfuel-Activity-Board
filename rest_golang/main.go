package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"sync"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/db"
	"mindfuel.ca/activity_rest/handler"
	"mindfuel.ca/activity_rest/socket"
)

// var addr = flag.String("addr", "wonderville.org:5556", "http service address")

var addr = flag.String("addr", "192.168.0.149:3210", "socket service address")
// Create wait group so that main thread finishes for goroutine to finish before terminating
var wg = sync.WaitGroup{}

func setupServer(mongoClient *mongo.Client) {
	log.Println("Setting up server...")
	r := chi.NewRouter()

	// Register routes
	handler := &handler.Handler{Db: mongoClient}
	r.Get("/users", handler.GetUsers)

	log.Fatal(http.ListenAndServe(":8080", r))
}

func main() {
	ctx := context.Background()

	// Connect to MongoDB
	mongoClient, err := db.GetMongoClient()
	if err != nil {
		log.Fatal("Error creating a MongoDB client: ", err)
	}
	log.Println("Successfully connected to MongoDB.")

	// Defer disconnection
	defer func() {
		if err := mongoClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	
	// Start socket listener
	wg.Add(1)
	go func() {
		socket.Listen(ctx, addr, mongoClient)
		wg.Done()
	}()
	
	// Setup REST API server
	setupServer(mongoClient)

	// Ensure main thread doesn't finish prior to go routines
	wg.Wait()
}
