import { AxiosResponse } from "axios";
import { Stats } from "./Stats";
import { User } from "./User";

export type ApiServiceInterface = {
  getHistoricalUsers: (fromDate: string) => Promise<AxiosResponse<UsersApiResponse>>;
  getStatsSummary: () => Promise<AxiosResponse<Stats[]>>;
};

export type UsersApiResponse = {
  users: User[];
  counts: { [category: string]: number };
}