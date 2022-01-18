import { AxiosResponse } from "axios";
import { MapBounds } from "./MapBounds";
import { Stats } from "./Stats";
import { User } from "./User";

export type ApiServiceInterface = {
  getHistoricalUsers: (fromDate: string, mapBounds? : MapBounds) => Promise<AxiosResponse<UsersApiResponse>>;
  getStatsSummary: () => Promise<AxiosResponse<Stats[]>>;
};

export type UsersApiResponse = {
  users: User[];
  counts: { [category: string]: number };
}