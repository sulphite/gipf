// External library imports
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

// Internal type imports
import IBoard from "../types/IBoard";
import { vectors } from "../types/vectors";

// Component imports
import { Tile } from "./Tile";

export class Board implements IBoard {
  grid: Grid<Tile>;
  uniqueRows: Grid<Tile>[]

  constructor() {
    this.grid = new Grid(Tile, spiral({ radius: 4 }));
    this.uniqueRows = this.getUniqueRows()
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
   * Helper method to find direction based on vectors.
   * Searches a predefined array of vectors to match input vectors to a direction.
   * @param q - q vector component
   * @param r - r vector component
   * @param s - s vector component
   * @returns The matching direction if found, throws an error otherwise.
   */
  private getDirectionByVectors(q: number, r: number, s: number): Direction {
    const enumIndex = vectors.find(
      (vector) => vector.q === q && vector.r === r && vector.s === s,
    );
    if (!enumIndex) {
      throw new Error("No valid direction found for the given vectors");
    }
    return enumIndex.direction;
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

  /**
   * Gets rows adjacent to a given coordinate where a piece can be pushed.
   * @param coord - The coordinate to search around.
   * @returns an array of Grid<Tile> objects, each containing a row that can accommodate a pushed piece.
   */
  getPushableRows(coord: HexCoordinates): Grid<Tile>[] {
    const neighbours = this.getInnerNeighbours(coord);

    return neighbours.reduce((pushableRows: Grid<Tile>[], tile: Tile) => {
      const row = this.getRow(coord, tile);
      if (this.isPushable(row)) {
        pushableRows.push(row);
      }
      return pushableRows;
    }, []);
  }

  /**
   * Pushes a piece from an outer tile into a row up to the first empty tile.
   * @param outerTile - The tile on the outer ring from which the piece originates.
   * @param innerTile - The tile in the inner ring neighboring the outer tile.
   */
  pushPiece(outerTile: HexCoordinates, innerTile: HexCoordinates): void {
    // Get the row, truncate after the first empty tile, and reverse it
    const firstEmptyIndex = this.getRow(outerTile, innerTile)
      .toArray()
      .findIndex((tile) => tile.fill === "");
    const rowArray = this.getRow(outerTile, innerTile)
      .toArray()
      .slice(0, firstEmptyIndex + 1)
      .reverse();

    // Add the tile from the outerTile coordinates into the array
    rowArray.push(this.grid.getHex(outerTile) as Tile);

    // Update each tile's fill, working backwards
    rowArray.forEach((tile, i, arr) => {
      if (i + 1 === arr.length) {
        tile.setFill("");
      } else {
        tile.setFill(arr[i + 1].fill);
      }
    });
  }

  /**
   * Checks if a row contains four consecutive tiles with identical non-empty fills.
   * @param row - The row of tiles to check.
   * @returns `true` if four consecutive identical fills are found, `false` otherwise.
   */
  hasFourConsecutiveFills(row: Grid<Tile>): boolean {
    const tilesArray = row.toArray().map((tile) => tile.fill);
    let startIndex: number = 0;
    let endIndex: number = 4;
    let consecutiveFills: string[];
    let consecutiveIndices: [number, number] | boolean = false;

    while (endIndex <= tilesArray.length) {
      consecutiveFills = tilesArray.slice(startIndex, endIndex);
      if (
        consecutiveFills.every(
          (piece) => piece && piece === consecutiveFills[0],
        )
      ) {
        consecutiveIndices = [startIndex, endIndex];
        endIndex += 1;
      } else {
        startIndex += 1;
        endIndex += 1;
      }
    }
    return consecutiveIndices ? true : false;
  }

  checkAllRows(): Grid<Tile>[] {
    const matchedRows: Grid<Tile>[] = []
    this.uniqueRows.forEach((row) => {
      if(this.hasFourConsecutiveFills(row)) {
        matchedRows.push(row)
      }
    })
    return matchedRows
  }

  /**
   * Gets all unique rows in all directions.
   * @returns an array of Grid<Tile> objects, each containing a unique row.
   */
  getUniqueRows(): Grid<Tile>[] {
    const uniqueRows: Grid<Tile>[] = [];

    // Assuming the grid is centered at 0,0
    // Only need to check one sixth of the directions due to symmetry
    const startingTiles = this.grid.filter(
      (tile) =>
        Math.abs(tile.q) === 4 ||
        Math.abs(tile.r) === 4 ||
        Math.abs(tile.s) === 4,
    );

    startingTiles.forEach((outerTile) => {
      const innerNeighbours = this.getInnerNeighbours(outerTile);
      innerNeighbours.forEach((innerTile) => {
        const row = this.getRow(outerTile, innerTile);
        if (
          !uniqueRows.some((existingRow) => this.areRowsEqual(existingRow, row))
        ) {
          uniqueRows.push(row);
        }
      });
    });

    return uniqueRows;
  }

  private areRowsEqual(firstRow: Grid<Tile>, secondRow: Grid<Tile>): boolean {
    if (firstRow.size !== secondRow.size) return false;

    for (const firstTile of firstRow) {
      const secondTile = secondRow.getHex([
        firstTile.q,
        firstTile.r,
        firstTile.s,
      ]);
      if (!secondTile) return false;
    }

    return true;
  }
}
