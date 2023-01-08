import { Color } from "@material-ui/lab/Alert";
import { AxiosResponse } from "axios";
import { Dispatch } from "redux";

import { Action } from "../utils/Action.enum";
import { AlertModel } from "../utils/Alert.model";
import { ApiServiceInterface, UsersApiResponse } from "../utils/ApiServiceInterface";
import { AppState, MAX_USERS } from "../utils/AppState";
import { AppUserLocation } from "../utils/AppUserLocation.model";
import { ActivityFilter } from "../utils/FilterOption.model";
import { MapBounds } from "../utils/MapBounds";
import { User } from "../utils/User";

export const fetchHistoricalUsers = (
  startDate: string,
  mapBounds: MapBounds,
  activityFilter?: ActivityFilter
) => {
  return (dispatch: Dispatch, getState: () => AppState, ApiService: ApiServiceInterface) => {
    dispatch(setLoading(true));
    const heatmapEnabled = getState().heatmapEnabled;
    return ApiService.getHistoricalUsers(
      startDate,
      mapBounds,
      heatmapEnabled ? 1000 : MAX_USERS,
      activityFilter
    ).then(
      (response: AxiosResponse<UsersApiResponse>) => {
        dispatch(updateHistoricalUsers(response.data));
        dispatch(setLoading(false));

        const usersLength: number = response.data.users.length;
        const sessions: number = response.data.counts.sessions;
        if (usersLength < sessions) {
          dispatch(
            setAlert(
              `There were lots of users! Only showing ${usersLength} of ${sessions} total user sessions on the map.`,
              "info"
            )
          );
        } else if (usersLength === 0) {
          dispatch(
            setAlert(
              "No users found for your selection. Please try again with a different time, filter or location!",
              "info"
            )
          );
        }
      },
      () => {
        dispatch(setLoading(false));
        dispatch(setAlert("Unable to complete request, please try again!", "error"));
      }
    );
  };
};

export const setAlert = (message: string | null, severity: Color = "success") => {
  const alert: AlertModel | null = message ? new AlertModel(message, severity) : null;

  return {
    type: Action.SET_ALERT,
    alert: alert,
  };
};

export const addLiveUser = (user: User) => {
  return {
    type: Action.ADD_LIVE_USER,
    user: user,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: Action.SET_LOADING,
    loading: loading,
  };
};

export const toggleHeatmap = (heatmapEnabled: boolean) => {
  return {
    type: Action.TOGGLE_HEATMAP,
    heatmapEnabled: heatmapEnabled,
  };
};

export const updateHistoricalUsers = (response: UsersApiResponse | null) => {
  response?.users.forEach((user: User) => {
    // Convert from ISO timestamp
    user.date = new Date(user.date);
  });

  return {
    type: Action.UPDATE_HISTORICAL_USERS,
    historicalUsers: response?.users,
    historicalCounts: response?.counts,
  };
};

export const setAppUserLocation = (appUserLocation: AppUserLocation) => {
  return {
    type: Action.SET_APP_USER_LOCATION,
    appUserLocation: appUserLocation,
  };
};
