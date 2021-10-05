import { Asset } from "./Asset";
import { Location } from "./Location";

export type User = {
  type: string,
  location: Location,
  ip?: string,
  asset?: Asset
}