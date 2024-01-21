import { HexCoordinates, defineHex } from "honeycomb-grid";
import { ITile } from "../shared/types/index";

export class Tile
  extends defineHex({ dimensions: 50, origin: "topLeft" })
  implements ITile
{
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
