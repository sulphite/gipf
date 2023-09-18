import { Board } from "../logic/Board";

const board = new Board();

test("outer coord returns true with isOuterTile", () => {
  const tile = board.grid.getHex([4, 0, -4]);
  tile && typeof tile.isOuterTile === "function"
    ? expect(tile.isOuterTile()).toBe(true)
    : fail("tile is undefined");
});

test("when I access the fill property it returns a string", () => {
  const tile = board.grid.getHex([0, 0]);
  tile && typeof tile.getFill === "function"
    ? expect(tile.getFill()).toBe("")
    : fail("tile is undefined");
});

test("I can set the fill property of a tile", () => {
  const tile = board.grid.getHex([0, 1, -1]);

  tile &&
    typeof tile.setFill === "function" &&
    typeof tile.getFill === "function"
    ? (tile.setFill("W"),
      expect(tile.getFill()).toBe("W"))
    : fail("tile is undefined");
});
