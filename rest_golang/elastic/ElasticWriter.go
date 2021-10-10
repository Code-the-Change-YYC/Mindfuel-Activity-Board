package elastic

import (
	"context"
	"encoding/json"
	"fmt"

	elastic "gopkg.in/olivere/elastic.v7"
)

func GetElasticClient() (*elastic.Client, error) {
	client, err := elastic.NewClient(elastic.SetURL("http://localhost:9200"),
		elastic.SetSniff(false),
		elastic.SetHealthCheck(false))

	fmt.Println("Elasticsearch initialized...")

	return client, err
}

func saveUsertoElastic() {
	ctx := context.Background()
	esclient, err := GetElasticClient()

	if err != nil {
		fmt.Println("Elastic init fail : ", err)
		panic("client failed")
	}

	//we need to get json from the socket and then this should write it
	//it will replace the something that is in the bracket
	dataJSON, err := json.Marshal("something")
	js := string(dataJSON)
	ind, err := esclient.Index().
		Index("wondervilleasset").
		BodyJson(js).
		Do(ctx)

	if err != nil {
		panic(err)
	}

	fmt.Println("inserstion successful")
}

// func saveUsertoElastic(jsonBytes []byte) {
// 	// TODO: use env file for this
// 	addresses := []string{"http://localhost:9200"}
// 	cfg := elasticsearch.Config{Addresses: addresses}
// 	client, err := elasticsearch.NewClient(cfg)
// 	if err != nil {
// 		log.Println("elastic client failed to connect:", err)
// 		return
// 	}

// 	log.Println(client)

// 	// Check if a "mindfuel_activity" index exists
// 	// Create a "mindfuel_activity" index if it doesn't
// 	// Write index and user payload to database
// 	// Look into geopoint type for storing lat/long pairs
// }
