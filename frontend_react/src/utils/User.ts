import { Asset } from "./Asset";
import { AssetType } from "./AssetType.enum";
import { Location } from "./Location";

export type User = {
  type: AssetType | string;
  date: any;
  payload: {
    location: Location;
    ip?: string;
    asset?: Asset;
    stats?: any;
    rank?: number;
  };
};
