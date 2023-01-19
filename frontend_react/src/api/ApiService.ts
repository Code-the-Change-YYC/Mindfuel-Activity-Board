import axios, { AxiosResponse } from "axios";
import Qs from "qs";

import {
  ActivityStatsApiResponse,
  ApiServiceInterface,
  FilterOptionsApiResponse,
  UsersApiResponse,
} from "../utils/ApiServiceInterface";
import { ActivityFilter } from "../utils/FilterOption.model";
import { MapBounds } from "../utils/MapBounds";

const http = axios.create({
  baseURL: `${[process.env.REACT_APP_GOLANG_API]}`,
  headers: {
    "Content-type": "application/json",
  },
});

// Format nested params correctly
http.interceptors.request.use((config) => {
  config.paramsSerializer = (params) => {
    return Qs.stringify(params, {
      arrayFormat: "brackets",
      encode: false,
    });
  };

  return config;
});

const getHistoricalUsers = (
  startDate: string,
  mapBounds: MapBounds,
  maxUsers: number,
  activityFilter?: ActivityFilter
): Promise<AxiosResponse<UsersApiResponse>> => {
  return http.get<UsersApiResponse>("/users", {
    params: {
      startDate: startDate,
      mapBounds: mapBounds,
      maxUsers: maxUsers,
      filter: activityFilter,
    },
  });
};

const getActivityStats = (
  startDate?: string,
  endDate?: string,
  top?: number
): Promise<AxiosResponse<ActivityStatsApiResponse>> => {
  return http.get<ActivityStatsApiResponse>("/activity-stats", {
    params: { startDate: startDate, endDate: endDate, top: top },
  });
};

const getActivityFilterOptions = (): Promise<AxiosResponse<FilterOptionsApiResponse>> => {
  return http.get<FilterOptionsApiResponse>("/activity-filter-options");
};

const ApiService: ApiServiceInterface = {
  getHistoricalUsers: getHistoricalUsers,
  getActivityStats: getActivityStats,
  getActivityFilterOptions: getActivityFilterOptions,
};

export default ApiService;
