package main

import (
	"context"
	"flag"
	"log"
	"sync"

	"mindfuel.ca/activity_rest/db"
	"mindfuel.ca/activity_rest/server"
	"mindfuel.ca/activity_rest/socket"
)

var addr = flag.String("addr", "wonderville.org:5556", "http service address")

// uncomment line below for local development using mocked server
// var addr = flag.String("addr", "localhost:3210", "socket service address")

// Create wait group so that main thread finishes for goroutine to finish before terminating
var wg = sync.WaitGroup{}

func main() {
	ctx := context.Background()

	// Connect to MongoDB
	mongoClient, err := db.GetMongoClient()
	if err != nil {
		log.Fatal(log.Ldate, " Error creating a MongoDB client: ", err)
	}
	log.Println(log.Ldate, " Successfully connected to MongoDB.")

	// Defer disconnection
	defer func() {
		if err := mongoClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	// Start socket listener as a separate GO routine
	wg.Add(1)
	go func() {
		socket.Listen(ctx, addr, mongoClient)
		wg.Done()
	}()

	// Setup and start REST API server
	server.Start(mongoClient)

	// Ensure main thread doesn't finish prior to go routines
	wg.Wait()
}
