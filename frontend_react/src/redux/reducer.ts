import { AppState } from "../utils/AppState";
import { User } from "../utils/User";

const initialState: AppState = {
  liveUsers: [],
  newUser: null,
  mapCenter: { lat: 48.354594, lng: -99.99805 },
};

const userReducer = (
  state: AppState | undefined = initialState,
  action: any
) => {
  switch (action.type) {
    case "ADD_USER":
      const user = action.user;
      console.log("User added: ", user);
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
    default:
      return state;
  }
};

export default userReducer;
