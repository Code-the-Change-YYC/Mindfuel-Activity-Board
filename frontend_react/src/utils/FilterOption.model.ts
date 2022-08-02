import { ActivityFilterField } from "./ActivityFIlterField.enum";
import { ActivityTypeEnum } from "./ActivityType.enum";

export type FilterOption = {
  name: string;
  type: string;
  colour: string;
};

export type ActivityFilter = {
  field: ActivityFilterField;
  value: string;
};

export const ActivityColourMap: Record<ActivityTypeEnum, string> = {
  [ActivityTypeEnum.ACTIVITY]: "#1F64AF",
  [ActivityTypeEnum.GAME]: "#f7901e",
  [ActivityTypeEnum.STORY]: "#948106",
  [ActivityTypeEnum.VIDEO]: "#00613e",
};
