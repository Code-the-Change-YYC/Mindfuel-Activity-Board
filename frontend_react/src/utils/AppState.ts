import { User } from "./User";

export type AppState = {
  displayedUsers: User[];
  liveUsers: User[];
  newUser: User | null;
  mapCenter: { lat: number; lng: number };
  loading: boolean;
  errorMessage: String | null;
  status: StatusEnum;
};

export enum StatusEnum {
  LIVE = "live",
  HISTORICAL = "historical",
}
