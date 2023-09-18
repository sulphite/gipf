import { Grid } from "honeycomb-grid";
import ITile from "./Tile";

interface IBoard {
  grid: Grid<ITile>;
}

export default IBoard;