import axios, { AxiosResponse } from "axios";
import Qs from "qs";

import {
  ActivityStatsApiResponse,
  ApiServiceInterface,
  UsersApiResponse,
} from "../utils/ApiServiceInterface";
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
  fromDate: string,
  mapBounds: MapBounds,
  maxUsers: number
): Promise<AxiosResponse<UsersApiResponse>> => {
  return http.get<UsersApiResponse>(`/users`, {
    params: { fromDate: fromDate, mapBounds: mapBounds, maxUsers: maxUsers },
  });
};

const getActivityStats = (allTime: boolean, fromDate?: string, top?: number): Promise<AxiosResponse<ActivityStatsApiResponse>> => {
  return http.get<ActivityStatsApiResponse>("/activity-stats", {
    params: { allTime: allTime, fromDate: fromDate, top: top }
  });
};

const ApiService: ApiServiceInterface = {
  getHistoricalUsers: getHistoricalUsers,
  getActivityStats: getActivityStats,
};

export default ApiService;
