import { ActivityFilterField } from "./ActivityFIlterField.enum";

export type FilterOption = {
  name: string;
  type: string;
};

export type ActivityFilter = {
  field: ActivityFilterField;
  value: string;
}