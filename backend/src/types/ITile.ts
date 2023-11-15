import { Hex } from "honeycomb-grid";

interface ITile extends Hex {
  fill: string;
  isOuterTile(): boolean;
  getFill(): string;
  setFill(state: string): void;
  clear(): void;
}

export default ITile;