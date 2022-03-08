import {
  ApiServiceInterface,
  UsersApiResponse,
} from "../utils/ApiServiceInterface";
import { MapBounds } from "../utils/MapBounds";
import { Stats } from "../utils/Stats";
import Qs from 'qs';
import axios from "axios";

const http = axios.create({
  // baseURL: `${[process.env.REACT_APP_FIREBASE_API]}`,
  baseURL: "http://localhost:8080/v1/api",
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

const getHistoricalUsers = (fromDate: string, mapBounds: MapBounds) => {
  // http.get("http://localhost:8080/v1/api/users")
  return http.get<UsersApiResponse>(`/users`, {
    params: { fromDate: fromDate, mapBounds: mapBounds },
  });
};

const getStatsSummary = () => {
  return http.get<Stats[]>("/statsSummary");
};

const ApiService: ApiServiceInterface = {
  getHistoricalUsers: getHistoricalUsers,
  getStatsSummary: getStatsSummary,
};

export default ApiService;
