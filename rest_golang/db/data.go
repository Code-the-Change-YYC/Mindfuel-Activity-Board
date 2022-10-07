package db

import (
	"context"
	"log"
	"sort"

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
		log.Println(log.Ldate, " Error inserting into the DB:", err)
		return err
	}
	if asset.Type == model.WondervilleAsset {
		log.Println(log.Ldate, " Inserted Wonderville Asset User:", *asset.Payload.Ip)
	} else {
		log.Println(log.Ldate, " Inserted Wonderville Session User:", asset.Payload.Location.Region)
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
		log.Println(log.Ldate, " No user found - ", users, err)
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
		log.Println(log.Ldate, " Not able to provide count - ", counts, err)
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
		log.Println(log.Ldate, " No activity stat found - ", activityStats, err)
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

	collection := client.Database("wondervilleDev").Collection("activityStats")
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
		_, err := collection.UpdateOne(context.TODO(), bson.D{{Key: "name", Value: incomingActivityName}},
			bson.D{{Key: "$inc", Value: bson.D{{Key: "hits", Value: 1}}}}, options.Update().SetUpsert(true))

		if err != nil {
			log.Fatal(err)
			return err
		}
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
			log.Fatal(err)
			return err
		}
	}
	//Return success without any error.
	return nil
}
