import {
  ActivityMapMarker,
  GameMapMarker,
  SessionMapMarker,
  StoryMapMarker,
  VideoMapMarker,
} from "../res/assets";
import { AssetType } from "./AssetType.enum";
import { User } from "./User";

const iconsMap: Record<string, string> = {
  activity: ActivityMapMarker,
  game: GameMapMarker,
  video: VideoMapMarker,
  story: StoryMapMarker,
  session: SessionMapMarker,
};

export const numberFormatter = (num: number, digits: number): string => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export const toDateTime = (secs: number): Date => {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
};

export const getMapMarkerIconForUser = (user: User): string => {
  const assetType =
    user.type === AssetType.WondervilleSession
      ? "session"
      : user.payload.asset!.type.toLowerCase();

  return iconsMap[assetType];
};

export const getTimelineDate = (val: number | number[]): Date | undefined => {
  let date: Date | undefined = new Date();

  switch (val) {
    case 0:
      date.setDate(date.getDate() - 3 * 30.4167);
      break;
    case 25:
      date.setDate(date.getDate() - 30.4167);
      break;
    case 50:
      date.setDate(date.getDate() - 7);
      break;
    case 75:
      date.setDate(date.getDate() - 1);
      break;
    case 100:
      date = undefined;
      break;
  }

  return date;
};
