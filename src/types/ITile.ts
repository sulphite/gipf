import { Grid, Hex } from "honeycomb-grid";

interface ITile extends Hex {
  fill?: string;
  isOuterTile?(): boolean;
  getFill?(): string | undefined;
  setFill?(state: string): void;
}

export default ITile;
