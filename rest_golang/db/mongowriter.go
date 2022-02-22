package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/model"
)

//CreateIssue - Insert a new document in the collection.
func InsertAssets(client *mongo.Client, asset model.AssetMessage) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database("wondervilleDev").Collection("users")
	//Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), asset)
	if err != nil {
		log.Println("Error inserting into the DB: ", err)
		return err
	}
	log.Println("Inserted Asset:", asset.Payload.Ip)
	//Return success without any error.
	return nil
}

func InsertSessions(client *mongo.Client, session model.SessionMessage) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database("wondervilleDev").Collection("users")
	//Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), session)
	if err != nil {
		log.Println("Error inserting into the DB: ", err)
		return err
	}
	log.Println("Inserted Session", session.Payload.Location)
	//Return success without any error.
	return nil
}
