import { Grid, Hex, spiral } from "honeycomb-grid";
import IBoard from "../types/Board";

export class Board implements IBoard {
  grid: Grid<Hex>

  constructor() {
    this.grid = new Grid(Hex, spiral({ radius: 4 }))
  }
}
