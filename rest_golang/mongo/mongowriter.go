package mongo

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/model"
)

//CreateIssue - Insert a new document in the collection.
func CreateIssue(client *mongo.Client, task model.AssetMessage) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database("wonderville_test").Collection("wondervilleAssets")
	//Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), task)
	if err != nil {
		log.Println("Error inserting into the DB: ", err)
		return err
	}
	log.Println(task)
	log.Println("Inserted")
	//Return success without any error.
	return nil
}
