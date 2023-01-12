package db

import (
	"context"
	"os"
	"sort"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"mindfuel.ca/activity_rest/logger"
	"mindfuel.ca/activity_rest/model"
)

var (
	database                string
	activityStatsCollection string
	usersCollection         string
)

func init() {
	// Define database and connections
	database = os.Getenv("MONGODB_DB_NAME") // Connector ensures that this value exists
	activityStatsCollection = "activityStats"
	usersCollection = "users"
}

// CreateIssue - Insert a new document in the collection.
func InsertUser(client *mongo.Client, asset model.User) error {
	// Create a handle to the respective collection in the database.
	collection := client.Database(database).Collection(usersCollection)
	// Perform InsertOne operation & validate against the error.
	_, err := collection.InsertOne(context.TODO(), asset)
	if err != nil {
		logger.Error.Println("Error inserting new user session into the DB: ", err)
		return err
	}
	if asset.Type == model.WondervilleAsset {
		logger.Info.Printf("Inserted Wonderville Asset User (%s) from %s", asset.Payload.Asset.Name, asset.Payload.Location.Country)
	} else {
		logger.Info.Println("Inserted Wonderville Session User from", asset.Payload.Location.Country)
	}

	// Return success without any error.
	return nil
}

// Get the users from the collection filtered by the fields in the UserFilter.
func GetUsers(client *mongo.Client, filter model.UserFilter) ([]model.User, error) {
	var users []model.User
	collection := client.Database(database).Collection(usersCollection)

	// Randomly sample the max number of users from collection.
	matchStage := bson.D{{Key: "$match", Value: GetUserQuery(filter)}}
	sampleStage := bson.D{{Key: "$sample", Value: bson.D{{Key: "size", Value: filter.MaxUsers}}}}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, sampleStage})
	if err != nil {
		logger.Error.Println("Unable to get users:", err)
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
	collection := client.Database(database).Collection(usersCollection)

	matchStage := bson.D{{Key: "$match", Value: GetUserQuery(filter)}}
	usersQuery := bson.A{bson.D{{Key: "$count", Value: "count"}}}
	countriesQuery := GetDistinctCountQuery("payload.location.country_name", "countries")
	citiesQuery := GetDistinctCountQuery("payload.location.city", "cities")

	facetStage := bson.D{{Key: "$facet", Value: bson.D{{Key: "sessions", Value: usersQuery}, {Key: "countries", Value: countriesQuery}, {Key: "cities", Value: citiesQuery}}}}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, facetStage})
	if err != nil {
		logger.Error.Println("Not able to get counts:", counts, err)
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

	// Query activityStats table if no startDate is provided (returns all time stats), otherwise query users table using startDate
	if filter.StartDateTimestamp == nil {
		collection := client.Database(database).Collection(activityStatsCollection)
		opts := options.Find().SetSort(bson.D{{Key: "hits", Value: -1}}).SetLimit(int64(*filter.Top))
		cursor, err = collection.Find(context.TODO(), bson.M{}, opts)
	} else {
		collection := client.Database(database).Collection(usersCollection)

		pipelineQuery := GetActivityStatsQuery(filter)
		cursor, err = collection.Aggregate(context.TODO(), pipelineQuery)
	}

	if err != nil {
		logger.Error.Println("Unable to get activity stats:", err)
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

// Gets a list of all activities and their categories to be used as filter options
func GetFilterOptions(client *mongo.Client) ([]model.FilterOption, error) {
	var filterOptions []model.FilterOption

	collection := client.Database(database).Collection(activityStatsCollection)
	fields := bson.D{{Key: "type", Value: 1}, {Key: "name", Value: 1}}
	opts := options.Find().SetProjection(fields).SetSort(fields)
	cursor, err := collection.Find(context.TODO(), bson.M{}, opts)

	if err != nil {
		return filterOptions, err
	}

	if err = cursor.All(context.TODO(), &filterOptions); err != nil {
		return filterOptions, err
	}

	// Get a list of unique activity categories from the list of activities
	uniqueCats := make(map[string]bool)
	categories := make([]model.FilterOption, 0)
	for _, v := range filterOptions {
		if !uniqueCats[v.Type] {
			uniqueCats[v.Type] = true
			catOption := model.FilterOption{
				Name: v.Type,
				Type: "Category",
			}
			categories = append(categories, catOption)
		}
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Type < categories[j].Type
	})

	// Return categories and activity filter options combined together
	return append(categories, filterOptions...), nil
}

// Inserts a new activity or updates the hits field of an existing activity in the activityStats collection
func InsertOrUpdateActivityStats(client *mongo.Client, user model.User) error {
	//Create a handle to the respective collection in the database.
	collection := client.Database(database).Collection(activityStatsCollection)
	//Check to see if activity is in the DB, if so update hit counter else
	//Perform InsertOne operation & validate against the error.
	incomingActivityName := user.Payload.Asset.Name

	filter := bson.M{"name": incomingActivityName}

	cursor, err := collection.Find(context.TODO(), filter)

	if err != nil {
		logger.Error.Printf("Error while inserting Activity Stats for %s: %v", incomingActivityName, err)
	}

	var res []bson.M

	if err = cursor.All(context.TODO(), &res); err != nil {
		logger.Error.Printf("Error while inserting Activity Stats for %s: %v", incomingActivityName, err)
	}

	if len(res) > 0 {
		_, err := collection.UpdateOne(context.TODO(), bson.D{{Key: "name", Value: incomingActivityName}},
			bson.D{{Key: "$inc", Value: bson.D{{Key: "hits", Value: 1}}}}, options.Update().SetUpsert(true))

		if err != nil {
			logger.Error.Printf("Unable to update Activity Stats for %s: %v", incomingActivityName, err)
			return err
		}

		logger.Info.Println("Updated Activity Stats record:", incomingActivityName)
	} else {
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
			logger.Error.Printf("Unable to insert Activity Stats for %s: %v", incomingActivityName, err)
			return err
		}

		logger.Info.Println("Inserted new Activity Stats record:", incomingActivityName)
	}
	//Return success without any error.
	return nil
}
