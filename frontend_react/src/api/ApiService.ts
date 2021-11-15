import { ApiServiceInterface } from "../utils/ApiServiceInterface";
import { Stats } from "../utils/Stats";
import { User } from "../utils/User";
import axios from "axios";

const http = axios.create({
  // baseURL: "http://localhost:8082/api",
  headers: {
    "Content-type": "application/json",
  },
});

const getHistoricalUsers = (fromDate: String) => {
  // return http.get<User[]>("/historicalUsers", {
  //   params: { fromDate: fromDate },
  // });
  return http.get("https://jsonplaceholder.typicode.com/users");
};

const getStatsSummary = () => {
  return http.get<Stats[]>("/statsSummary");
};

const ApiService: ApiServiceInterface = {
  getHistoricalUsers: getHistoricalUsers,
  getStatsSummary: getStatsSummary,
};

export default ApiService;
