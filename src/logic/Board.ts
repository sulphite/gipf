import {
  CubeCoordinates,
  Grid,
  Direction,
  HexCoordinates,
  defaultHexSettings,
  ring,
  spiral,
  line,
  toCube,
  Traverser,
} from "honeycomb-grid";

import IBoard from "../types/IBoard";
import { Tile } from "./Tile";

// Type definition for vector mapping direction to cube coordinates
type Vector = {
  direction: Direction;
  q: number;
  r: number;
  s: number;
};

// Predefined vector values for each hexagonal direction
const vectors: Vector[] = [
  { direction: Direction.NE, q: 1, r: -1, s: 0 },
  { direction: Direction.E, q: 1, r: 0, s: -1 },
  { direction: Direction.SE, q: 0, r: 1, s: -1 },
  { direction: Direction.SW, q: -1, r: 1, s: 0 },
  { direction: Direction.W, q: -1, r: 0, s: 1 },
  { direction: Direction.NW, q: 0, r: -1, s: 1 },
];

export class Board implements IBoard {
  grid: Grid<Tile>;

  constructor() {
    this.grid = new Grid(Tile, spiral({ radius: 4 }));
  }

  /**
   * Retrieves all neighboring tiles of a given coordinate within grid boundaries.
   * @param coord - The coordinate to search around.
   * @returns a Grid object containing the neighboring tiles.
   */
  getNeighbours(coord: HexCoordinates): Grid<Tile> {
    const ringTraverser: Traverser<Tile> = ring({
      center: coord,
      radius: 1,
    }) as Traverser<Tile>;
    return this.grid.traverse(ringTraverser);
  }
  /**
   * Retrieves only the neighboring tiles located in the inner ring.
   * @param coord - The coordinate to search around.
   * @returns a Grid object containing the inner neighboring tiles.
   */
  getInnerNeighbours(coord: HexCoordinates): Grid<Tile> {
    return this.getNeighbours(coord).filter((tile) => !tile.isOuterTile());
  }

  /**
   * Prints the board's state to the console.
   */
  printBoard(): void {
    console.log(this.grid.toJSON());
  }

  /**
   * Helper method to find direction based on vectors.
   * Searches a predefined array of vectors to match input vectors to a direction.
   * @param q - q vector component
   * @param r - r vector component
   * @param s - s vector component
   * @returns The matching direction if found, throws an error otherwise.
   */
  getDirectionByVectors(q: number, r: number, s: number): Direction {
    const enumIndex = vectors.find(
      (vector) => vector.q === q && vector.r === r && vector.s === s,
    );
    if (!enumIndex) {
      throw new Error("No valid direction found for the given vectors");
    }
    return enumIndex.direction;
  }

  /**
   * Determines the direction from one coordinate to another neighboring coordinate.
   * @param coordA - The starting coordinate.
   * @param coordB - The destination coordinate.
   * @returns The direction from coordA to coordB.
   */
  findDirection(coordA: HexCoordinates, coordB: HexCoordinates): Direction {
    const cubeA: CubeCoordinates = toCube(defaultHexSettings, coordA);
    const cubeB: CubeCoordinates = toCube(defaultHexSettings, coordB);
    const dir: [number, number, number] = [
      cubeB.q - cubeA.q,
      cubeB.r - cubeA.r,
      cubeB.s - cubeA.s,
    ];

    return this.getDirectionByVectors(...dir);
  }

  /**
   * Generates a row of tiles based on a given outer tile and its inner neighbor.
   * @param outerTile - The tile on the outer ring.
   * @param innerTile - The tile in the inner ring neighboring the outer tile.
   * @returns a Grid object containing the tiles forming the row, excluding outer tiles.
   */
  getRow(outerTile: HexCoordinates, innerTile: HexCoordinates): Grid<Tile> {
    const dir = this.findDirection(outerTile, innerTile);
    const vector: Traverser<Tile> = line({
      start: innerTile,
      direction: dir,
      length: 7,
    }) as Traverser<Tile>;
    const row = this.grid.traverse(vector);
    return row.filter((tile) => !tile.isOuterTile());
  }

  /**
   * Checks if the row can accommodate a pushed piece.
   * @param row - The row of tiles to check.
   * @returns `true` if there's space for the pushed piece, `false` otherwise.
   */
  isPushable(row: Grid<Tile>): boolean {
    return row.toArray().some((tile) => {
      return tile.fill === "";
    });
  }
}
