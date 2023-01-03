package db

import (
	"context"
	"os"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"mindfuel.ca/activity_rest/logger"
)

/* Used to create a singleton object of MongoDB client.
Initialized and exposed through  GetMongoClient().*/
var clientInstance *mongo.Client

// Used during creation of singleton client object in GetMongoClient().
var clientInstanceError error

// Used to execute client creation procedure only once.
var mongoOnce sync.Once

// GetMongoClient - Return mongodb connection to work with
func GetMongoClient() (*mongo.Client, error) {
	// Perform connection creation operation only once.
	mongoOnce.Do(func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		connectionString := os.Getenv("MONGODB_URI")
		databaseName := os.Getenv("MONGODB_DB_NAME")

		if connectionString == "" {
			logger.Error.Fatal("You must set your 'MONGODB_URI' environmental variable")
		}
		if databaseName == "" {
			logger.Error.Fatal("You must set your 'MONGODB_DB_NAME' environmental variable")
		}

		// Set client options
		clientOptions := options.Client().ApplyURI(connectionString)
		// Connect to MongoDB
		client, err := mongo.Connect(ctx, clientOptions)
		if err != nil {
			clientInstanceError = err
		} else {
			// Check the connection
			err = client.Ping(ctx, nil)
			if err != nil {
				clientInstanceError = err
			}
			clientInstance = client
		}
	})

	return clientInstance, clientInstanceError
}
