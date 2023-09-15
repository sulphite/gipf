import { Grid, HexCoordinates, ring, spiral } from "honeycomb-grid";
import IBoard from "../types/Board";
import ITile from "../types/Tile";
import { Tile } from "./Tile";

export class Board implements IBoard {
  grid: Grid<ITile>;

  constructor() {
    this.grid = new Grid(Tile, spiral({ radius: 4 })) as Grid<ITile>;
  }

  isOuterTile(coord: HexCoordinates) {
    return this.grid.distance(coord, [0, 0]) === 4;
  }

  getFill(coord: HexCoordinates) {
    const thisTile = this.grid.getHex(coord);
    return thisTile?.fill;
  }

  setFill(coord: HexCoordinates, state: string): void {
    const thisTile = this.grid.getHex(coord);
    if (thisTile) {
      thisTile.fill = state;
    }
    console.log(this.grid.getHex(coord));
  }

  getNeighbours(coord: HexCoordinates) {
    const ringTraverser = ring({ center: coord, radius: 1 });
    return this.grid.traverse(ringTraverser);
  }

  getInnerNeighbours(coord: HexCoordinates) {
    return this.getNeighbours(coord).filter((hex) => !this.isOuterTile(hex));
  }

  printBoard() {
    console.log(this.grid.toJSON())
  }
}
