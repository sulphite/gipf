import { Hex } from "honeycomb-grid";

interface ITile extends Hex {
  fill?: string;
  isOuterTile?(): boolean;
}

export default ITile;
