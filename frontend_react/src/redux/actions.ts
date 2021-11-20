import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { ApiServiceInterface } from "../utils/ApiServiceInterface";
import { AlertModel } from "../utils/Alert.model";
import { AppState } from "../utils/AppState";
import { User } from "../utils/User";
import { Color } from "@material-ui/lab/Alert";

export const fetchHistoricalUsers = (fromDate: string) => {
  return (
    dispatch: Dispatch,
    getState: () => AppState,
    ApiService: ApiServiceInterface
  ) => {
    dispatch(loading(true));
    return ApiService.getHistoricalUsers(fromDate).then(
      (response: AxiosResponse<User[]>) => {
        console.log("from time", fromDate);
        console.log(response.data);
        dispatch(displayHistoricalUsers(response.data));
        dispatch(loading(false));
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

export const displayLiveUsers = () => {
  return {
    type: "DISPLAY_LIVE_USERS",
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

const displayHistoricalUsers = (historicalUsers: User[]) => {
  return {
    type: "DISPLAY_HISTORICAL_USERS",
    historicalUsers: historicalUsers,
  };
};
