package db

import (
	"go.mongodb.org/mongo-driver/bson"
	"mindfuel.ca/activity_rest/model"
)

// Returns the user match query corresponding to the filters provided in the HTTP request.
func GetUserQuery(filter model.UserFilter) bson.M {
	matchQuery := bson.M{
		"date":                      bson.M{"$gte": filter.StartDate},
		"payload.location.latitude": bson.M{"$gte": filter.LatLower, "$lte": filter.LatUpper},
	}

	if filter.FilterValue != nil {
		// Extra insurance, ensure user is wondervilleAsset type
		matchQuery["type"] = bson.M{"$eq": model.WondervilleAsset}
		if *filter.FilterField == model.CategoryFilter {
			matchQuery["payload.asset.type"] = bson.M{"$eq": filter.FilterValue}
		} else if *filter.FilterField == model.ActivityTypeFilter {
			matchQuery["payload.asset.name"] = bson.M{"$eq": filter.FilterValue}
		}
	}

	if filter.LngLower <= filter.LngUpper {
		matchQuery["payload.location.longitude"] = bson.M{"$gte": filter.LngLower, "$lte": filter.LngUpper}
	} else {
		// We need to account for longitude ranges which cross the start/end bounds of -180 and 180
		lngQuery := []bson.M{
			{"payload.location.longitude": bson.M{"$gte": filter.LngLower, "$lte": 180}},
			{"payload.location.longitude": bson.M{"$gte": -180, "$lte": filter.LngUpper}},
		}
		matchQuery["$or"] = lngQuery
	}

	return matchQuery
}

// Return a distinct count query for the specified field.
// The query will return the count under the provided key name.
func GetDistinctCountQuery(field string, key string) bson.A {
	return bson.A{
		bson.D{{Key: "$match", Value: bson.D{{Key: field, Value: bson.D{{Key: "$ne", Value: ""}}}}}},
		bson.D{{Key: "$group", Value: bson.D{{Key: "_id", Value: nil}, {Key: key, Value: bson.D{{Key: "$addToSet", Value: "$" + field}}}}}},
		bson.D{{Key: "$unwind", Value: "$" + key}},
		bson.D{{Key: "$group", Value: bson.D{{Key: "_id", Value: nil}, {Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}}}}},
	}
}

// Groups by asset name and counts the number of instances of each asset.
// Returns in sorted order and respects the limit provided by the filter.
func GetActivityStatsQuery(filter model.StatsFilter) []bson.D {

	query := []bson.D{
		{{Key: "$match", Value: bson.M{"$and": []bson.M{{"type": bson.M{"$eq": model.WondervilleAsset}}, {"date": bson.M{"$gte": filter.StartDate, "$lte": filter.EndDate}}}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$payload.asset.name"},
			{Key: "imageUrl", Value: bson.M{"$first": "$payload.asset.imageUrl"}},
			{Key: "url", Value: bson.M{"$first": "$url"}},
			{Key: "type", Value: bson.M{"$first": "$payload.asset.type"}},
			{Key: "hits", Value: bson.M{"$sum": 1}}}}},
		{{Key: "$project", Value: bson.D{
			{Key: "_id", Value: 0},
			{Key: "name", Value: "$_id"},
			{Key: "hits", Value: 1},
			{Key: "imageUrl", Value: 1},
			{Key: "type", Value: 1},
			{Key: "url", Value: 1}}}},
		{{Key: "$sort", Value: bson.D{{Key: "hits", Value: -1}}}},
	}

	if *filter.Top > 0 {
		query = append(query, bson.D{{Key: "$limit", Value: filter.Top}})
	}

	return query
}
