import { ApiServiceInterface, UsersApiResponse } from "../utils/ApiServiceInterface";
import { Stats } from "../utils/Stats";
import axios from "axios";

const http = axios.create({
  baseURL: `${[process.env.REACT_APP_FIREBASE_API]}`,
  headers: {
    "Content-type": "application/json",
  },
});

const getHistoricalUsers = (fromDate: string) => {
  return http.get<UsersApiResponse>("/user", {
    params: { fromDate: fromDate },
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
