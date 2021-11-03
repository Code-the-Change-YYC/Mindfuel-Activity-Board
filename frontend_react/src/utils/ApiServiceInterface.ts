import { AxiosResponse } from "axios";
import { Stats } from "./Stats";
import { User } from "./User";

export type ApiServiceInterface = {
  getHistoricalUsers: (fromDate: string) => Promise<AxiosResponse<User[]>>;
  getStatsSummary: () => Promise<AxiosResponse<Stats[]>>;
};
