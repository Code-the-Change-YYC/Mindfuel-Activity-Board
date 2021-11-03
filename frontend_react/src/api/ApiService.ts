import http from "../http-common";
import { ApiServiceInterface } from "../utils/ApiServiceInterface";
import { Stats } from "../utils/Stats";
import { User } from "../utils/User";

const getHistoricalUsers = (fromDate: String) => {
  return http.get<User[]>("/historicalUsers", {
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
