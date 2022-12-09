import { AlertModel } from "./Alert.model";
import { User } from "./User";

export type AppState = {
  liveUsers: User[];
  historicalUsers: User[] | null;
  historicalCounts: { [id: string]: number } | null;
  liveCounts: LiveCounts;
  newUser: User | null;
  loading: boolean;
  alert: AlertModel | null;
  heatmapEnabled: boolean;
};

export type LiveCounts = {
  sessions: number;
  countries: Set<string>;
  cities: Set<string>;
};

export const MAX_USERS = 100;
