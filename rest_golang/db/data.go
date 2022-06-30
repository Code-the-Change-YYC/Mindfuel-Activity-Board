package db

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"mindfuel.ca/activity_rest/model"
)

type activityStatsFields struct {
	count int64 `bson:"count"`
}

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
	var cursor *mongo.Cursor
	var err error

	// Query activityStats table if no fromDate is provided (returns all time stats), otherwise query users table using fromDate
	if filter.FromDateTimestamp == nil {
		collection := client.Database("wondervilleDev").Collection("activityStats")
		opts := options.Find().SetSort(bson.D{{Key: "hits", Value: -1}}).SetLimit(int64(*filter.Top))
		cursor, err = collection.Find(context.TODO(), bson.M{}, opts)
	} else {
		collection := client.Database("wondervilleDev").Collection("users")
		pipelineQuery := GetActivityStatsQuery(filter)
		cursor, err = collection.Aggregate(context.TODO(), pipelineQuery)
	}

	if err != nil {
		return activityStats, err
	}

	if err = cursor.All(context.TODO(), &activityStats); err != nil {
		return activityStats, err
	}

	// Set rank field from the index
	for i := range activityStats {
		activityStats[i].Rank = i + 1
	}

	return activityStats, nil
}

func InsertActivityStats(client *mongo.Client, user model.User) error {
	var err error
	//Create a handle to the respective collection in the database.
	collection := client.Database("wondervilleDev").Collection("activityStats")
	//Check to see if activity is in the DB, if so update hit counter else
	//Perform InsertOne operation & validate against the error.
	incomingActivityName := user.Payload.Asset.Name

	filter := bson.M{"name": incomingActivityName}

	cursor, err := collection.Find(context.TODO(), filter)

	if err != nil {
		panic(err)
	}

	var res []bson.M

	if err = cursor.All(context.TODO(), &res); err != nil {
		panic(err)
	}

	if len(res) > 0 {
		fmt.Println("Finding hit for exisiting activity")
		_, err := collection.UpdateOne(context.TODO(), bson.D{{"name", incomingActivityName}},
			bson.D{{"$inc", bson.D{{"hits", 1}}}}, options.Update().SetUpsert(true))

		if err != nil {
			log.Fatal(err)
			return err
		}

		log.Println("Activity hit updated")

	} else {
		log.Println("No existing activity, creating a new entry")

		assetName := user.Payload.Asset.Name
		assetURL := user.Payload.Asset.Url
		assetType := user.Payload.Asset.Type
		assetImageURL := user.Payload.Asset.ImageUrl

		activityToInsert := bson.D{
			{Key: "name", Value: assetName},
			{Key: "url", Value: assetURL},
			{Key: "type", Value: assetType},
			{Key: "imageUrl", Value: assetImageURL},
			{Key: "hits", Value: 1},
		}

		_, err := collection.InsertOne(context.TODO(), activityToInsert)

		if err != nil {
			log.Fatal(err)
			return err
		}

		log.Println("New Activity Inserted")
	}

	log.Println("Inserted Session")
	//Return success without any error.
	return nil
}
