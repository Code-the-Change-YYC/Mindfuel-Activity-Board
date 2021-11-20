import { AlertModel } from "./Alert.model";
import { User } from "./User";

export type AppState = {
  displayedUsers: User[];
  liveUsers: User[];
  newUser: User | null;
  mapCenter: { lat: number; lng: number };
  loading: boolean;
  alert: AlertModel | null;
  status: StatusEnum;
};

export enum StatusEnum {
  LIVE = "live",
  HISTORICAL = "historical",
}
