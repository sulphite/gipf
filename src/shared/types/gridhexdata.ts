import { Point } from "honeycomb-grid";

export type GridHexData = {
  fill: string;
  q: number;
  r: number;
  corners: Point[];
  outer: boolean;
  clickable?: boolean;
};
