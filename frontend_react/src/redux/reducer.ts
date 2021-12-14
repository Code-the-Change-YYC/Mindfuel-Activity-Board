import { AppState } from "../utils/AppState";
import { User } from "../utils/User";
import * as sampleData from "../api/SampleUserData.json";
import _ from "lodash";

const initialState: AppState = {
  liveUsers: sampleData.users,
  historicalUsers: sampleData.users,
  newUser: null,
  mapCenter: { lat: 48.354594, lng: -99.99805 },
  loading: false,
  alert: null,
};

const rootReducer = (
  state: AppState | undefined = initialState,
  action: any
) => {
  switch (action.type) {
    case "ADD_USER":
      const user = action.user;
      const newMapCenter = _.isNil(state.historicalUsers) ? {
        lat: user.location.latitude,
        lng: user.location.longitude,
      } : state.mapCenter;
      const liveUsers: User[] = [...state.liveUsers, user];

      // Sort in descending order by latitude to avoid overlapping on map
      liveUsers.sort(
        (a: User, b: User) => b.location.latitude - a.location.latitude
      );

      // Record sorted index so that it is displayed on map properly
      user.index = liveUsers.findIndex(user);
      
      // TODO: Process duplicate dates + activity, keep latest date
  
      return {
        ...state,
        newUser: user,
        liveUsers: liveUsers,
        mapCenter: newMapCenter,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "UPDATE_HISTORICAL_USERS":
      // TODO: Process duplicates?

      return {
        ...state,
        historicalUsers: action.historicalUsers,
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
