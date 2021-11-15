import { AppState } from "../utils/AppState";
import { User } from "../utils/User";

const initialState: AppState = {
  displayedUsers: [],
  liveUsers: [],
  newUser: null,
  mapCenter: { lat: 48.354594, lng: -99.99805 },
  loading: false,
};

const rootReducer = (
  state: AppState | undefined = initialState,
  action: any
) => {
  switch (action.type) {
    case "ADD_USER":
      const user = action.user;
      const newMapCenter = {
        lat: user.location.latitude,
        lng: user.location.longitude,
      };
      const liveUsers = [...state.liveUsers, user];

      // Sort in descending order by latitude to avoid overlapping on map
      liveUsers.sort(
        (a: User, b: User) => b.location.latitude - a.location.latitude
      );

      return {
        ...state,
        newUser: user,
        liveUsers: [...state.liveUsers, user],
        mapCenter: newMapCenter,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "DISPLAY_LIVE_USERS":
      return {
        ...state,
        displayedUsers: state.liveUsers,
      };
    case "DISPLAY_HISTORICAL_USERS":
      return {
        ...state,
        displayedUsers: action.historicalUsers,
      };
    default:
      return state;
  }
};

export default rootReducer;
