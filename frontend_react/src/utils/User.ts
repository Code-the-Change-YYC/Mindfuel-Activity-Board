import { Asset } from "./Asset";
import { Location } from "./Location";

export type User = {
  type: string;
  location: Location;
  date: Date;
  ip?: string;
  asset?: Asset;
};
