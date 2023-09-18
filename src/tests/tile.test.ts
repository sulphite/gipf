import { Board } from "../logic/Board";

const board = new Board();

test("outer coord returns true with isOuterTile", () => {
    const tile = board.grid.getHex([4, 0, -4]);
    tile && typeof tile.isOuterTile === 'function'
        ? expect(tile.isOuterTile()).toBe(true)
        : fail("tile is undefined");
});

test("when I access the fill property it returns a string", () => {
    const tile = board.grid.getHex([0, 0]);
    tile && typeof tile.getFill === 'function'
        ? expect(tile.getFill(board.grid)).toBe("")
        : fail("tile is undefined");
});