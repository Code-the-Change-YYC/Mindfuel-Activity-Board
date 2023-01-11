import _ from "lodash";

import { Action } from "../utils/Action.enum";
import { AppState, LiveCounts, MAX_USERS } from "../utils/AppState";
import { User } from "../utils/User";

const initialUserCount: LiveCounts = {
  sessions: 0,
  countries: new Set(),
  cities: new Set(),
};

const initialState: AppState = {
  liveUsers: [],
  historicalUsers: null,
  historicalCounts: null,
  liveCounts: initialUserCount,
  newUser: null,
  loading: false,
  alert: null,
  appUserLocation: null,
  heatmapEnabled: false,
  isWebSocketConnected: false,
};

const rootReducer = (state: AppState | undefined = initialState, action: any) => {
  switch (action.type) {
    case Action.ADD_LIVE_USER:
      const user: User = action.user;
      user.payload = _.omit(user.payload, ["stats", "rank"]);

      const liveUsers: User[] = [...state.liveUsers, user];
      // Maximum 125 users on screen to preserve performance
      if (liveUsers.length > MAX_USERS && !state.heatmapEnabled) {
        liveUsers.shift();
      }

      const liveCounts = updateLiveCounts(user, { ...state.liveCounts });

      return {
        ...state,
        newUser: user,
        liveUsers: liveUsers,
        liveCounts: liveCounts,
      };
    case Action.UPDATE_HISTORICAL_USERS:
      return {
        ...state,
        newUser: null,
        historicalUsers: action.historicalUsers,
        historicalCounts: action.historicalCounts,
      };
    case Action.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case Action.TOGGLE_HEATMAP:
      return {
        ...state,
        heatmapEnabled: action.heatmapEnabled,
      };
    case Action.SET_APP_USER_LOCATION:
      return {
        ...state,
        appUserLocation: action.appUserLocation,
      };
    case Action.SET_WEBSOCKET_CONNECTION_STATUS:
      return {
        ...state,
        isWebSocketConnected: action.isWebSocketConnected,
      };
    case Action.SET_ALERT:
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
