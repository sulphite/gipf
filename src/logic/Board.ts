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

export class Board implements IBoard {
  grid: Grid<Tile>;

  constructor() {
    this.grid = new Grid(Tile, spiral({ radius: 4 }));
  }

  /**
   * returns all neighbour tiles of a coordinate, within grid limits
   * @param coord a hexcoordinate
   * @returns a set of tiles as Grid
   */
  getNeighbours(coord: HexCoordinates) {
    const ringTraverser: Traverser<Tile> = ring({
      center: coord,
      radius: 1,
    }) as Traverser<Tile>;
    return this.grid.traverse(ringTraverser);
  }
  /**
   * returns only the neighbour tiles on the inner rings.
   * @param coord a hexcoordinate
   * @returns a set of tiles as Grid
   */
  getInnerNeighbours(coord: HexCoordinates) {
    return this.getNeighbours(coord).filter((tile) => !tile.isOuterTile());
  }

  printBoard(): void {
    console.log(this.grid.toJSON());
  }

  /**
   * finds the direction from coord A to coord B
   * @param coordA a hexcoordinate
   * @param coordB a neighbouring hex
   * @returns Direction
   */
  findDirection(coordA: HexCoordinates, coordB: HexCoordinates): Direction {
    const cubeA: CubeCoordinates = toCube(defaultHexSettings, coordA);
    const cubeB: CubeCoordinates = toCube(defaultHexSettings, coordB);
    const dir: [number, number, number] = [
      cubeB.q - cubeA.q,
      cubeB.r - cubeA.r,
      cubeB.s - cubeA.s,
    ];

    type Vector = {
      direction: Direction;
      q: number;
      r: number;
      s: number;
    };

    const vectors: Vector[] = [
      { direction: Direction.NE, q: 1, r: -1, s: 0 },
      { direction: Direction.E, q: 1, r: 0, s: -1 },
      { direction: Direction.SE, q: 0, r: 1, s: -1 },
      { direction: Direction.SW, q: -1, r: 1, s: 0 },
      { direction: Direction.W, q: -1, r: 0, s: 1 },
      { direction: Direction.NW, q: 0, r: -1, s: 1 },
    ];

    function getDirectionByVectors(q: number, r: number, s: number): Direction {
      const enumIndex = vectors.find(
        (vector) => vector.q === q && vector.r === r && vector.s === s,
      );
      if (!enumIndex) {
        throw new Error("no valid direction found");
      }
      return enumIndex.direction;
    }

    return getDirectionByVectors(...dir);
  }

  /**
   * takes two tiles to calculate direction, and creates a row in that direction
   * @param outerTile a tile on the outer ring
   * @param innerTile an inner neighbour of outerTile
   * @returns a row of tiles starting from innerTile
   */
  getRow(outerTile: HexCoordinates, innerTile: HexCoordinates) {
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
   * checks if a row has space to accommodate a pushed piece
   * @param row a row of Tiles
   * @returns boolean
   */
  isPushable(row: Grid<Tile>): boolean {
    return row.toArray().some((tile) => {
      return tile.fill === "";
    });
  }
}
