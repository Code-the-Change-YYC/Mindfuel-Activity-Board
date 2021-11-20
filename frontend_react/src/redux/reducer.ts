import { AppState, StatusEnum } from "../utils/AppState";
import { User } from "../utils/User";

const initialState: AppState = {
  displayedUsers: [],
  liveUsers: [],
  newUser: null,
  mapCenter: { lat: 48.354594, lng: -99.99805 },
  loading: false,
  alert: null,
  status: StatusEnum.LIVE,
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
      const liveUsers: User[] = [...state.liveUsers, user];

      // Sort in descending order by latitude to avoid overlapping on map
      liveUsers.sort(
        (a: User, b: User) => b.location.latitude - a.location.latitude
      );

      return {
        ...state,
        newUser: state.status === StatusEnum.LIVE ? user : null,
        displayedUsers:
          state.status === StatusEnum.LIVE ? liveUsers : state.displayedUsers,
        liveUsers: liveUsers,
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
        status: StatusEnum.LIVE,
      };
    case "DISPLAY_HISTORICAL_USERS":
      return {
        ...state,
        displayedUsers: action.historicalUsers,
        status: StatusEnum.HISTORICAL,
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
