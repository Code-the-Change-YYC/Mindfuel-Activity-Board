import { AlertModel } from "./Alert.model";
import { User } from "./User";

export type AppState = {
  liveUsers: User[];
  historicalUsers: User[] | null;
  newUser: User | null;
  mapCenter: { lat: number; lng: number };
  loading: boolean;
  alert: AlertModel | null;
};