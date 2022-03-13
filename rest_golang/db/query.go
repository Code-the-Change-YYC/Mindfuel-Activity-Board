package db

import (
	"go.mongodb.org/mongo-driver/bson"
	"mindfuel.ca/activity_rest/model"
)

// Returns the user match query corresponding to the filters provided in the HTTP request.
func GetUserQuery(filter model.UserFilter) bson.M {
	matchQuery := bson.M{
		"date":                      bson.M{"$gt": filter.FromDate},
		"payload.location.latitude": bson.M{"$gte": filter.LatLower, "$lte": filter.LatUpper},
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
		bson.D{{Key: "$project", Value: bson.D{{Key: "_id", Value: 0}, {Key: "count", Value: 1}}}},
	}
}
