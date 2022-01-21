import { Location } from "./Location";

export const toDateTime = (secs: number): Date => {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

export const sameDay = (d1?: Date | string, d2?: Date | string) => {
  if (d1 === undefined || d2 === undefined) {
    return false;
  }

  d1 = typeof d1 === "string" ? new Date(d1) : d1;
  d2 = typeof d2 === "string" ? new Date(d2) : d2;

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const sameLocation = (l1: Location, l2: Location) => {
  if (l1.latitude === l2.latitude && l1.longitude === l2.longitude) {
    return true;
  }
  return false;
};
