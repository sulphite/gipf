import { Hex } from "honeycomb-grid";
import ITile from "../types/Tile";

export class Tile extends Hex implements ITile {
  fill = "";

  isOuterTile() {
    return [this.q, this.r, this.s].some(value => Math.abs(value) === 4);
  }
}
