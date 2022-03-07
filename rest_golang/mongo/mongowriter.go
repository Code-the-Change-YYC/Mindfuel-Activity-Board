package mongo

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/model"
)

//CreateIssue - Insert a new document in the collection.
func InsertAssets(client *mongo.Client, asset model.AssetMessage) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database("wonderville_test").Collection("wondervilleAll")
	//Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), asset)
	if err != nil {
		log.Println("Error inserting into the DB: ", err)
		return err
	}
	log.Println(asset)
	log.Println("Inserted Asset")
	//Return success without any error.
	return nil
}

func InsertSessions(client *mongo.Client, session model.SessionMessage) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database("wonderville_test").Collection("wondervilleAll")
	//Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), session)
	if err != nil {
		log.Println("Error inserting into the DB: ", err)
		return err
	}
	log.Println(session)
	log.Println("Inserted Session")
	//Return success without any error.
	return nil
}

func InsertStats(client *mongo.Client, stats model.StatsMessage) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database("wonderville_test").Collection("stats")
	//Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), stats)
	if err != nil {
		log.Println("Error inserting into the DB: ", err)
		return err
	}
	log.Println(stats)
	log.Println("Inserted Session")
	//Return success without any error.
	return nil
}
