import { Direction } from "honeycomb-grid";
import { Board } from "../logic/Board";

const board = new Board();

test("creates a grid with 61 hexes", () => {
  expect(board.grid.size).toEqual(61);
});

test("I can get the hex with coord 0,0,0", () => {
  const centerTile = board.grid.getHex([0, 0]);
  console.log(centerTile);
  expect(centerTile).toBeDefined;
  expect(centerTile?.q).toBe(0);
});

test("I cant get a hex outside of the grid", () => {
  expect(board.grid.getHex([5, 0])).toBeUndefined;
});

// isOuterTile(coord) returns a boolean
test("I can check if a coordinate is outer", () => {
  expect(board.isOuterTile([0, 0, 0])).toBe(false);
});

test("outer coord returns true with isOuterTile", () => {
  const tile = board.grid.getHex([4, 0, -4]);
  if (tile && typeof tile.isOuterTile === 'function') {
    expect(tile.isOuterTile()).toBe(true);
  } else {
    fail("Tile is undefined or doesn't have the isOuterTile method.");
  }
  // expect(board.isOuterTile([4, 0, -4])).toBe(true);
});

test("when I access the fill property it returns a string", () => {
  expect(board.getFill([0, 0])).toBe("");
});

test("I can set the fill property of a tile", () => {
  board.setFill([0, 1, -1], "W");
  expect(board.getFill([0, 1, -1])).toBe("W");
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
