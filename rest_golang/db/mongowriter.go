package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/model"
)

//CreateIssue - Insert a new document in the collection.
func InsertUser(client *mongo.Client, asset model.User) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database("wondervilleDev").Collection("users")
	//Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), asset)
	if err != nil {
		log.Println("Error inserting into the DB:", err)
		return err
	}
	if asset.Type == model.WondervilleAsset {
		log.Println("Inserted Wonderville Asset User:", *asset.Payload.Ip)
	} else {
		log.Println("Inserted Wonderville Session User:", asset.Payload.Location.Region)
	}

	//Return success without any error.
	return nil
}
