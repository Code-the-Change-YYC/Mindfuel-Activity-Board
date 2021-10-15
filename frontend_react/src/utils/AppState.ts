import { User } from "./User";

export type AppState = {
  liveUsers: User[];
  mapCenter: { lat: number; lng: number };
};
