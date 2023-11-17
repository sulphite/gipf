import { Hex, HexCoordinates } from "honeycomb-grid";
import { ITile } from "../types/index";

export class Tile extends Hex implements ITile {
  fill: string;

  constructor(coordinates?: HexCoordinates) {
    super(coordinates);
    this.fill = "";
  }

  isOuterTile() {
    return [this.q, this.r, this.s].some((value) => Math.abs(value) === 4);
  }

  getFill() {
    return this.fill;
  }

  setFill(state: string): void {
    this.fill = state;
  }

  clear(): void {
    this.fill = "";
  }
}
