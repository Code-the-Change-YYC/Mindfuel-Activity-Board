package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"mindfuel.ca/activity_rest/model"
)

// CreateIssue - Insert a new document in the collection.
func InsertUser(client *mongo.Client, asset model.User) error {
	// Create a handle to the respective collection in the database.
	collection := client.Database("wondervilleDev").Collection("users")
	// Perform InsertOne operation & validate against the error.
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

	// Return success without any error.
	return nil
}

// Get the users from the collection filtered by the fields in the UserFilter.
func GetUsers(client *mongo.Client, filter model.UserFilter) ([]model.User, error) {
	var users []model.User
	collection := client.Database("wondervilleDev").Collection("users")

	// Randomly sample the max number of users from collection.
	matchStage := bson.D{{Key: "$match", Value: GetUserQuery(filter)}}
	sampleStage := bson.D{{Key: "$sample", Value: bson.D{{Key: "size", Value: filter.MaxUsers}}}}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, sampleStage})
	if err != nil {
		return users, err
	}
	defer cursor.Close(context.TODO())

	if err = cursor.All(context.TODO(), &users); err != nil {
		return users, err
	}

	// Create empty list if users is empty
	if users == nil {
		users = make([]model.User, 0)
	}

	return users, nil
}

// Get the user, country and city counts from the collection filtered by the fields in the UserFilter.
func GetCounts(client *mongo.Client, filter model.UserFilter) (model.RawCounts, error) {
	var counts model.RawCounts
	collection := client.Database("wondervilleDev").Collection("users")

	matchStage := bson.D{{Key: "$match", Value: GetUserQuery(filter)}}
	usersQuery := bson.A{bson.D{{Key: "$count", Value: "count"}}}
	countriesQuery := GetDistinctCountQuery("payload.location.country_name", "countries")
	citiesQuery := GetDistinctCountQuery("payload.location.city", "cities")

	facetStage := bson.D{{Key: "$facet", Value: bson.D{{Key: "sessions", Value: usersQuery}, {Key: "countries", Value: countriesQuery}, {Key: "cities", Value: citiesQuery}}}}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, facetStage})
	if err != nil {
		return counts, err
	}
	defer cursor.Close(context.TODO())

	var result []model.RawCounts
	if err = cursor.All(context.TODO(), &result); err != nil {
		return counts, err
	}

	counts = result[0]

	return counts, nil
}

// Gets activity stats ranked in descending order by number of hits
func GetActivityStats(client *mongo.Client, filter model.StatsFilter) ([]model.ActivityStats, error) {
	var activityStats []model.ActivityStats

	if filter.AllTime {
		collection := client.Database("wondervilleDev").Collection("activityStats")
		opts := options.Find().SetSort(bson.D{{Key: "hits", Value: -1}}).SetLimit(int64(*filter.Top))
		cursor, err := collection.Find(context.TODO(), bson.M{}, opts)
		if err != nil {
			return activityStats, err
		}
		if err = cursor.All(context.TODO(), &activityStats); err != nil {
			return activityStats, err
		}
	}

	return activityStats, nil
}
