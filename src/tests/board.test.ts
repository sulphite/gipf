import { Direction } from "honeycomb-grid";
import { Board } from "../logic/Board";

let board: Board;

beforeEach(() => {
  board = new Board();
});

test("creates a grid with 61 hexes", () => {
  expect(board.grid.size).toEqual(61);
});

test("I can get the hex with coord 0,0,0", () => {
  const centerTile = board.grid.getHex([0, 0]);
  expect(centerTile).toBeDefined;
  expect(centerTile?.q).toBe(0);
});

test("I cant get a hex outside of the grid", () => {
  expect(board.grid.getHex([5, 0])).toBeUndefined;
});

test("given a tile we can get all neighbours", () => {
  const neighbourTiles = board.getNeighbours([0, 0]);
  expect(neighbourTiles.size).toBe(6);
});

test("given an outer tile we can get all inner neighbours", () => {
  const innerNeighbours = board.getInnerNeighbours([4, 0]);
  expect(innerNeighbours.size).toBe(1);
  expect(innerNeighbours.getHex([3, 0])).toBeDefined;
});

test("given two neighboring hexes we can get the direction from A to B", () => {
  const direction = board.findDirection([0, 0, 0], [0, 1, -1]);
  expect(direction).toBe(Direction.SE);
});

test("given an outer tile and a neighboring inner tile I can get a row of only the inner tiles", () => {
  const row = board.getRow([4, 0], [3, 0]);
  const expectedRowLength = row.filter((tile) => !tile.isOuterTile()).size;
  expect(expectedRowLength).toEqual(row.size);
});

test("given an outer tile not at the corner I can get a row of only the inner tiles", () => {
  const row = board.getRow([4, -1], [3, 0]);
  const expectedRowLength = row.filter((tile) => !tile.isOuterTile()).size;
  expect(expectedRowLength).toEqual(row.size);
});

test("given a row isPushable returns `true` if there is at least one unfilled tile in the row", () => {
  const row = board.getRow([4, 0], [3, 0]);
  expect(board.isPushable(row)).toBe(true);
});

test("given a full row, isPushable returns `false` as there are no unfilled tiles in the row for the piece to move in to", () => {
  const row = board.getRow([4, 0], [3, 0]);
  row.forEach((tile) => tile.setFill("W"));
  expect(board.isPushable(row)).toBe(false);
});

test("given an outer coord we can get the adjoining rows that have space", () => {
  expect(board.getPushableRows([4, -1]).length).toEqual(2);
  board.getRow([4, -1], [3, 0]).forEach((tile) => tile.setFill("B"));
  expect(board.getPushableRows([4, -1]).length).toEqual(1);
  board.grid.getHex([3, 0])?.setFill("");
  expect(board.getPushableRows([4, -1]).length).toEqual(2);
});

test("when there is no space we get an empty array", () => {
  board.getRow([4, -1], [3, 0]).forEach((tile) => tile.setFill("B"));
  board.getRow([4, -1], [3, -1]).forEach((tile) => tile.setFill("B"));
  expect(board.getPushableRows([4, -1]).length).toEqual(0);
});

test("when a piece is pushed into the board, the order of existing pieces is maintained", () => {
  const row = board.getRow([4, -1], [3, -1]).forEach((tile) => {
    if (tile.q % 2 === 0) {
      tile.setFill("B");
    } else {
      tile.setFill("W");
    }
  });
  board.grid.getHex([4, -1])?.setFill("B");
  board.grid.getHex([0, -1])?.setFill("");
  // const before = row.toArray().map(tile => tile.fill)
  board.pushFill([4, -1], [3, -1]);
  const after = row.toArray().map((tile) => tile.fill);
  expect(after).toEqual(["B", "W", "B", "W", "W", "B"]);
  expect(board.isPushable(row)).toBeFalsy();
});

test("a piece can be pushed when there are multiple gaps", () => {
  const row = board.getRow([4, -1], [3, -1]).forEach((tile) => {
    if (tile.q > 0) {
      tile.setFill("W");
    }
  });
  board.grid.getHex([4, -1])?.setFill("B");
  // const before = row.toArray().map(tile => tile.fill)
  board.pushFill([4, -1], [3, -1]);
  const after = row.toArray().map((tile) => tile.fill);
  expect(after).toEqual(["B", "W", "W", "W", "", ""]);
  expect(board.isPushable(row)).toBeTruthy();
});
