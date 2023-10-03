import { HexCoordinates } from "../types/hex";
import { Board } from "./Board";

export class Game {
  board;
  score: { black: number; white: number };
  currentPlayerBlack: boolean;

  constructor() {
    this.board = new Board();
    this.score = { black: 15, white: 15 };
    this.currentPlayerBlack = true;
  }

  placePiece(coord: HexCoordinates) {
    const player = this.currentPlayerBlack ? "black" : "white"
    const legalRows = this.board.getInnerNeighbours(coord).filter(tile => this.board.isPushable(this.board.getRow(coord, tile)))
    if(legalRows.size > 0) {
      this.board.fillTile(coord, player)
      this.score[player] -= 1
    }
    return this.board.printBoard()
  }


  /*
    game turn:
    - check that current player has tiles remaining; end game if not
    player selects a tile
      - check associated rows for space to make sure this is valid placement
        board.getInnerNeighbours(coord).forEach(tile => board.isPushable(getRow(coord, tile)))
      - send ok with valid directions
    player selects a direction/innertile
      - push pieces
      pushPiece(coord, innertile)
      - check for gipfs
      board.checkAllRows()
        - if there is one, we clear tiles & adjust scores

        - if there is more than one:
        player selects which gipf to activate
        - clear the tiles & adjust scores
    end of turn
  */
}
