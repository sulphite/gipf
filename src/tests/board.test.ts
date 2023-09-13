import { Board } from "../logic/Board"

test("creates a board with 61 hexes", () => {
  const board = new Board;
  expect(board.grid.size).toEqual(61)
})
