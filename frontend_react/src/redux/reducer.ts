import { AppState } from "../utils/AppState";
import { User } from "../utils/User";
import * as sampleData from "../api/SampleUserData.json";
import _, { update } from "lodash";
import { AssetType } from "../utils/AssetType.enum";
import { sameDay, sameLocation } from "../utils/helpers";

sampleData.users.map((user) => {
  const newUser: User = {
    ...user,
    date: new Date(),
  };
  return newUser;
});

const sampleUsers: User[] = sampleData.users;

const initialState: AppState = {
  liveUsers: [],
  historicalUsers: null,
  newUser: null,
  loading: false,
  alert: null,
};

const rootReducer = (
  state: AppState | undefined = initialState,
  action: any
) => {
  switch (action.type) {
    case "ADD_USER":
      const user: User = action.user;
      user.payload = _.omit(user.payload, ["stats", "rank"]);

      // Do not include duplicate wondervilleSessions from the same day
      if (user.type === AssetType.WondervilleSession) {
        const duplicates = state.liveUsers
          .filter(
            (existingUser: User) =>
              existingUser.type === AssetType.WondervilleSession
          )
          .filter(
            (existingUser: User) =>
              sameDay(existingUser.date, user.date) &&
              sameLocation(existingUser.payload.location, user.payload.location)
          );

        if (duplicates.length > 0) {
          return state;
        }
      }

      const liveUsers: User[] = [...state.liveUsers, user];

      return {
        ...state,
        newUser: user,
        liveUsers: liveUsers,
      };
    case "UPDATE_HISTORICAL_USERS":
      return {
        ...state,
        newUser: null,
        historicalUsers: action.historicalUsers,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "ALERT":
      return {
        ...state,
        alert: action.alert,
      };
    default:
      return state;
  }
};

export default rootReducer;
