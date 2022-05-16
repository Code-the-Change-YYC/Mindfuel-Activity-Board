import { AxiosResponse } from "axios";

import { MapBounds } from "./MapBounds";
import { Stats } from "./Stats";
import { User } from "./User";

export type ApiServiceInterface = {
  getHistoricalUsers: (fromDate: string, mapBounds: MapBounds, maxUsers: number) => Promise<AxiosResponse<UsersApiResponse>>;
  getActivityStats: (allTime: boolean, fromDate?: string, top?: number) => Promise<AxiosResponse<ActivityStatsApiResponse>>;
};

export type UsersApiResponse = {
  users: User[];
  counts: { [category: string]: number };
}

export type ActivityStatsApiResponse = {
  stats: Stats[];
  counts: { [category: string]: number };
}
