import { Board } from "../../logic/Board";

let board: Board;

beforeEach(() => {
  board = new Board();
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
  board.pushPiece([4, -1], [3, -1]);
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
  board.pushPiece([4, -1], [3, -1]);
  const after = row.toArray().map((tile) => tile.fill);
  expect(after).toEqual(["B", "W", "W", "W", "", ""]);
  expect(board.isPushable(row)).toBeTruthy();
});

test("given a row I can check if it contains 4 consecutive pieces of the same colour", () => {
  const filledRow = board
    .getRow([4, -1], [3, 0])
    .forEach((tile) => tile.setFill("B"));
  expect(board.hasFourConsecutiveFills(filledRow)).toBe(true);
  expect(board.hasFourConsecutiveFills(board.getRow([4, -1], [3, -1]))).toBe(
    false,
  );
});

test("I can check the entire board for rows containing 4 consecutive pieces of the same colour and receive matches", () => {
  expect(board.checkAllRows()).toHaveLength(0);
  board.getRow([4, -1], [3, 0]).forEach((tile) => tile.setFill("B"));
  const result = board.checkAllRows();
  expect(result).toHaveLength(1);
});
