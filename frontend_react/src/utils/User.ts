import { Asset } from "./Asset";
import { Location } from "./Location";

export type User = {
  type: string;
  date?: Date | string;
  payload: {
    location: Location;
    ip?: string;
    asset?: Asset;
    stats?: any;
    rank?: number;
  };
};
