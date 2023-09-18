import { Grid } from "honeycomb-grid";
import ITile from "./ITile";

interface IBoard {
  grid: Grid<ITile>;
}

export default IBoard;
