import { AxiosResponse } from "axios";
import { FilterOption } from "./FilterOption";

import { MapBounds } from "./MapBounds";
import { Stats } from "./Stats";
import { User } from "./User";

export type ApiServiceInterface = {
  getHistoricalUsers: (fromDate: string, mapBounds: MapBounds, maxUsers: number) => Promise<AxiosResponse<UsersApiResponse>>;
  getActivityStats: (fromDate?: string, top?: number) => Promise<AxiosResponse<ActivityStatsApiResponse>>;
  getActivityFilterOptions: () => Promise<AxiosResponse<FilterOptionsApiResponse>>;
};

export type UsersApiResponse = {
  users: User[];
  counts: { [category: string]: number };
}

export type ActivityStatsApiResponse = {
  stats: Stats[];
}

export type FilterOptionsApiResponse = {
  options: FilterOption[];
}
