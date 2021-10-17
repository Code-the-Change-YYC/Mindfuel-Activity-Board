import { User } from "./User";

export type AppState = {
  liveUsers: User[];
  newUser: User | null;
  mapCenter: { lat: number; lng: number };
};
