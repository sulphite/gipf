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

  getNeighbours(coord: HexCoordinates) {
    const ringTraverser: Traverser<Tile> = ring({
      center: coord,
      radius: 1,
    }) as Traverser<Tile>;
    return this.grid.traverse(ringTraverser);
  }

  getInnerNeighbours(coord: HexCoordinates) {
    return this.getNeighbours(coord).filter((tile) => !tile.isOuterTile());
  }

  printBoard(): void {
    console.log(this.grid.toJSON());
  }

  findDirection(coordA: HexCoordinates, coordB: HexCoordinates) {
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

    function getDirectionByVectors(
      q: number,
      r: number,
      s: number,
    ): Direction | undefined {
      const enumIndex = vectors.find(
        (vector) => vector.q === q && vector.r === r && vector.s === s,
      );
      return enumIndex ? enumIndex.direction : undefined;
    }

    const result = getDirectionByVectors(...dir);
    return result;
  }

  getRow(outerTile: HexCoordinates, innerTile: HexCoordinates) {
    const dir = this.findDirection(outerTile, innerTile);
    if (dir) {
      const vector: Traverser<Tile> = line({
        start: innerTile,
        direction: dir,
        length: 7,
      }) as Traverser<Tile>;
      const row = this.grid.traverse(vector);
      return row;
    }
  }

  isPushable(row: Grid<Tile>) {
    return row.toArray().some((tile) => {
      return tile.fill === "";
    });
  }
}
