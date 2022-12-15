export type MapBounds = {
  lat: Bounds;
  lng: Bounds;
};

type Bounds = {
  lower: number;
  upper: number;
};
