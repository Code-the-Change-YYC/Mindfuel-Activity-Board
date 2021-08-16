package elastic

import (
	"log"
	"github.com/elastic/go-elasticsearch/v7"
)

func saveUsertoElastic(jsonBytes []byte) {
	// TODO: use env file for this
	addresses := []string{"http://localhost:9200"}
	cfg := elasticsearch.Config{Addresses: addresses}
	client, err := elasticsearch.NewClient(cfg)
	if err != nil {
		log.Println("elastic client failed to connect:", err)
		return
	}

	log.Println(client)

	// Check if a "mindfuel_activity" index exists
	// Create a "mindfuel_activity" index if it doesn't 
	// Write index and user payload to database
	// Look into geopoint type for storing lat/long pairs
}

