import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import {
  ApiServiceInterface,
  UsersApiResponse,
} from "../utils/ApiServiceInterface";
import { AlertModel } from "../utils/Alert.model";
import { AppState } from "../utils/AppState";
import { User } from "../utils/User";
import { Color } from "@material-ui/lab/Alert";
import { MapBounds } from "../utils/MapBounds";

export const fetchHistoricalUsers = (
  fromDate: string,
  mapBounds: MapBounds
) => {
  return (
    dispatch: Dispatch,
    getState: () => AppState,
    ApiService: ApiServiceInterface
  ) => {
    dispatch(loading(true));
    return ApiService.getHistoricalUsers(fromDate, mapBounds).then(
      (response: AxiosResponse<UsersApiResponse>) => {
        dispatch(updateHistoricalUsers(response.data));
        dispatch(loading(false));

        const usersLength: number = response.data.users.length;
        const sessions: number = response.data.counts.sessions;
        if (usersLength < sessions) {
          dispatch(
            setAlert(
              `There were lots of users! Only showing ${usersLength} of ${sessions} total user sessions on the map.`,
              "info"
            )
          );
        }
      },
      () => {
        dispatch(loading(false));
        dispatch(
          setAlert("Unable to complete request, please try again!", "error")
        );
      }
    );
  };
};

export const setAlert = (
  message: string | null,
  severity: Color = "success"
) => {
  const alert: AlertModel | null = message
    ? new AlertModel(message, severity)
    : null;

  return {
    type: "ALERT",
    alert: alert,
  };
};

export const addLiveUser = (user: User) => {
  return {
    type: "ADD_USER",
    user: user,
  };
};

export const loading = (loading: boolean) => {
  return {
    type: "LOADING",
    loading: loading,
  };
};

export const updateHistoricalUsers = (response: UsersApiResponse | null) => {
  return {
    type: "UPDATE_HISTORICAL_USERS",
    historicalUsers: response?.users,
    historicalCounts: response?.counts,
  };
};
