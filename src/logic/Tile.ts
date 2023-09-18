import { Grid, Hex } from "honeycomb-grid";
import ITile from "../types/ITile";

export class Tile extends Hex implements ITile {
  fill = "";

  isOuterTile() {
    return [this.q, this.r, this.s].some((value) => Math.abs(value) === 4);
  }

  getFill(grid: Grid<ITile>) {
    const thisTile = grid.getHex([this.q, this.r, this.s]);
    return thisTile?.fill;
  }

  setFill(grid: Grid<ITile>, state: string): void {
    const thisTile = grid.getHex([this.q, this.r, this.s]);
    if (thisTile) {
      thisTile.fill = state;
    }
  }
}
