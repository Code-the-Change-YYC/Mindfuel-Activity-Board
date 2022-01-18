export type MapBounds = {
  latBounds: Bounds;
  lngBounds: Bounds;
};

type Bounds = {
  lower: number;
  upper: number;
}