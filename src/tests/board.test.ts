import { Board } from "../logic/Board";
import ITile from "../types/Tile";

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
  expect(board.isOuterTile([4, 0, -4])).toBe(true);
});

// can access fill property of tiles
test("when I access the fill property it returns a string", () => {
  expect(board.getFill([0, 0])).toBe("");
});

// can fill a tile
test("I can set the fill property of a tile", () => {
  board.setFill([0, 1, -1], "W");
  expect(board.getFill([0, 1, -1])).toBe("W");
});

test("given a tile we can get all neighbours", () => {
  const neighbourTiles: ITile[] = board.getNeighbours([0, 0]);
  expect(neighbourTiles).toHaveLength(6);
});

test("given an outer tile we can get all inner neighbours", () => {
  const innerNeighbours: ITile[] = board.getInnerNeighbours([4, 0]);
  expect(innerNeighbours).toHaveLength(1);
  expect(innerNeighbours[0].equals([3, 0])).toBe(true);
});
