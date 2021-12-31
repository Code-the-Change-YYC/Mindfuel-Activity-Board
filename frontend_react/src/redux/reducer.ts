import { AppState } from "../utils/AppState";
import { User } from "../utils/User";
import * as sampleData from "../api/SampleUserData.json";
import _ from "lodash";

const sampleUsers: User[] = sampleData.users.map(user => {
  const newUser: User = {
    ...user,
    date: new Date(),
  };
  return newUser;
})

const initialState: AppState = {
  liveUsers: sampleUsers,
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
      const user = action.user;
      const liveUsers: User[] = [...state.liveUsers, user];
      
      // TODO: Process duplicate dates + activity, keep latest date
  
      return {
        ...state,
        newUser: user,
        liveUsers: liveUsers,
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
