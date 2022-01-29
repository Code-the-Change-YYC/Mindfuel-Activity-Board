import {
  ApiServiceInterface,
  UsersApiResponse,
} from "../utils/ApiServiceInterface";
import axios from "axios";
import Qs from 'qs';
import { Stats } from "../utils/Stats";
import { MapBounds } from "../utils/MapBounds";

const http = axios.create({
  baseURL: `${[process.env.REACT_APP_FIREBASE_API]}`,
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

const getHistoricalUsers = (fromDate: string, mapBounds?: MapBounds) => {
  return http.get<UsersApiResponse>("/user", {
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
