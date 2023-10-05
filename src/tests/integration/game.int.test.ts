import { Game } from "../../logic/Game";

let game: Game;

beforeEach(() => {
  game = new Game();
});

// I can create a game and see that it has a board and two players
// I can see each player has ... tiles
test("I can create a game and see that it has a board and the players have starting pieces", () => {
  expect(game.board).toBeDefined();
  expect(game.score).toHaveProperty("white");
  expect(game.score).toHaveProperty("black");
  expect(game.score.black).toEqual(15);
});

// as the white tile player I can place a tile
// as the white tile player I should see my tile count has gone down
// I can see the board has been updated to include a white tile
// as the white tile player I should not be able to place another tile

// ---
test("I can place a piece and my piece count will decrease", () => {
  expect(game.score.black).toBe(15);
  const response = game.placePiece([4, -1]);
  game.makeMove([4, -1], [response[0].q, response[0].r]);
  expect(game.score.black).toBe(14);
  expect(response[0].fill).toBe("B");
});

// 1. as the white tile player I place four tiles in a row
// 1.5 check tile number before placing fourth
// 2. when I place the fourth tile I receive back all four tiles (check number)
// 3. those tiles are no longer on the board
test("I can place 4 tiles in a row and my piece count will be updated", () => {
  game.placePiece([4,-1])
  game.makeMove([4, -1], [3,-1]);
  game.placePiece([4,-1])
  game.makeMove([4, -1], [3,-1]);
  game.placePiece([4,-1])
  game.makeMove([4, -1], [3,-1]);
  expect(game.score.black).toBe(12)
  game.placePiece([4,-1])
  game.makeMove([4, -1], [3,-1]);
  expect(game.score.black).toBe(15)
})
// ---

// see notes of situations where one player will lose tiles
// I see that I have lost tiles that are no longer in play ...
test("captured pieces in the row are removed from play and not returned", () => {
  game.placePiece([4,-1])
  game.makeMove([4, -1], [3,-1]);
  game.endTurn();
  for (let i = 0; i < 3; i++) {
    game.placePiece([4,-1])
    game.makeMove([4, -1], [3,-1]);
    game.endTurn();
    game.placePiece([1, -4])
    game.makeMove([1, -4], [0,-3]);
    game.endTurn();
  }
  expect(game.score).toEqual({black: 11, white: 12})
  // const row = game.board.getRow([4, -1], [3, -1]).toArray().map(tile => [tile.q, tile.fill])
  // console.log(row)
  expect(game.board.grid.getHex([-2,-1])?.fill).toBe("B")
  game.placePiece([4,-1]) //white move
  game.makeMove([4, -1], [3,-1]);
  expect(game.board.grid.getHex([-2,-1])?.fill).toBe("")
  expect(game.board.grid.getHex([-1,-2])?.fill).toBe("B") //tile outside row should be unaffected
  expect(game.score).toEqual({black: 11, white: 15})
})
