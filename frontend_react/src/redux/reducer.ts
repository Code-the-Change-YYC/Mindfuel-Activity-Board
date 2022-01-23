import { AppState, LiveCounts } from "../utils/AppState";
import { User } from "../utils/User";
import * as sampleData from "../api/SampleUserData.json";
import _ from "lodash";
import { AssetType } from "../utils/AssetType.enum";
import { sameDay, sameLocation } from "../utils/helpers";

sampleData.users.map((user) => {
  const newUser: User = {
    ...user,
    date: new Date(),
  };
  return newUser;
});

// const sampleUsers: User[] = sampleData.users;

const initialUserCount: LiveCounts = {
  sessions: 0,
  countries: new Set(),
  cities: new Set(),
};

const initialState: AppState = {
  liveUsers: [],
  historicalUsers: null,
  historicalCounts: {},
  liveCounts: initialUserCount,
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
      // Maximum 100 users on screen to maintain performance
      if (liveUsers.length > 125) {
        liveUsers.shift();
      }

      const liveCounts = updateLiveCounts(user, { ...state.liveCounts });
    
      return {
        ...state,
        newUser: user,
        liveUsers: liveUsers,
        liveCounts: liveCounts,
      };
    case "UPDATE_HISTORICAL_USERS":
      return {
        ...state,
        newUser: null,
        historicalUsers: action.historicalUsers,
        historicalCounts: action.historicalCounts,
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

const updateLiveCounts = (user: User, liveCounts: LiveCounts) => {
  liveCounts.sessions++;
  if (!_.isNil(user.payload.location.country_name)) {
    liveCounts.countries.add(user.payload.location.country_name);
  }
  if (!_.isNil(user.payload.location.city)) {
    liveCounts.cities.add(user.payload.location.city);
  }

  return liveCounts;
};

export default rootReducer;
