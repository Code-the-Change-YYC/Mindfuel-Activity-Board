import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { ApiServiceInterface } from "../utils/ApiServiceInterface";
import { User } from "../utils/User";

export const fetchHistoricalUsers = (fromDate: string) => {
  return (dispatch: Dispatch, ApiService: ApiServiceInterface) => {
    dispatch(loading(true));
    return ApiService.getHistoricalUsers(fromDate).then((response: AxiosResponse<User[]>) => {
      dispatch(displayHistoricalUsers(response.data));
      dispatch(loading(false));
    }, () => dispatch(loading(false)));
  };
};

export const addLiveUser = (user: User) => {
  return {
    type: "ADD_USER",
    user: user,
  };
};

const loading = (loading: boolean) => {
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
