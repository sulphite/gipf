import { Grid, Hex } from "honeycomb-grid";

interface ITile extends Hex {
  fill?: string;
  isOuterTile?(): boolean;
  getFill?(grid: Grid<ITile>): string | undefined;
}

export default ITile;
