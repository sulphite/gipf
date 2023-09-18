import { Grid, Hex } from "honeycomb-grid";
import ITile from "../types/ITile";

export class Tile extends Hex implements ITile {
  fill = "";

  isOuterTile() {
    return [this.q, this.r, this.s].some(value => Math.abs(value) === 4);
  }

  getFill() {
    return this.fill;
  }

  setFill(state: string): void {
    this.fill = state;
  }
}
