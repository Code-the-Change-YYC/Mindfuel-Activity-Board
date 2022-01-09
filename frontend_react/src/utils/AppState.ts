import { AlertModel } from "./Alert.model";
import { User } from "./User";

export type AppState = {
  liveUsers: User[];
  historicalUsers: User[] | null;
  mapBounds: { 
    latBounds: Bound;
    lngBounds: Bound;
  } | null;
  newUser: User | null;
  loading: boolean;
  alert: AlertModel | null;
};

type Bound = {
  lower: number;
  upper: number;
}
