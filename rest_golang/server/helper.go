package server

import (
	"net/url"
	"time"

	"mindfuel.ca/activity_rest/model"
)

func GetQueryParams(params url.Values) (model.UserFilter, error) {
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

func GetCountOrZero(values []model.CountsValue) int {
	if len(values) > 0 {
		return values[0].Val
	}

	return 0
}
