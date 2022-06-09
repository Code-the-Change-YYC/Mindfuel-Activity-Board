package server

import (
	"net/url"
	"time"

	"mindfuel.ca/activity_rest/model"
)

func GetUserQueryParams(params url.Values) (model.UserFilter, error) {
	var filter model.UserFilter
	if err := decoder.Decode(&filter, params); err != nil {
		return filter, err
	}

	fromDate, err := time.Parse(time.RFC3339, params.Get("fromDate"))
	if err != nil {
		return filter, err
	}
	filter.FromDate = fromDate

	return filter, nil
}

func GetStatsQueryParams(params url.Values) (model.StatsFilter, error) {
	var filter model.StatsFilter
	if err := decoder.Decode(&filter, params); err != nil {
		return filter, err
	}

	if filter.FromDateTimestamp != nil {
		fromDate, err := time.Parse(time.RFC3339, params.Get("fromDate"))
		if err != nil {
			return filter, err
		}
		filter.FromDate = fromDate
	}

	if filter.Top == nil {
		filter.Top = new(int)  // Set as zero value int as to not limit the Mongo query
	} 

	return filter, nil
}

func GetCountOrZero(values []model.CountsValue) int {
	if len(values) > 0 {
		return values[0].Val
	}

	return 0
}
