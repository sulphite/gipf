import { HexCoordinates } from "../shared/types/index";
import { Board } from "./Board";

export class Game {
  board;
  score: { black: number; white: number };
  currentPlayerBlack: boolean;
  winner: null | string;
  player1: string;
  player2: string;

  constructor() {
    this.board = new Board();
    this.score = { black: 15, white: 15 };
    this.currentPlayerBlack = true;
    this.player1 = "";
    this.player2 = "";
    this.winner = null;
  }

  checkGameEnd(): void {
    if (this.currentPlayerBlack && this.score.black == 0) {
      this.winner = "white";
    } else if (!this.currentPlayerBlack && this.score.white == 0) {
      this.winner = "black";
    }
  }

  // board is not updated; we only update the board after a move.
  getPushableTiles(coord: HexCoordinates) {
    // const player = this.currentPlayerBlack ? "black" : "white";
    const legalTiles = this.board
      .getInnerNeighbours(coord)
      .filter((tile) => this.board.isPushable(this.board.getRow(coord, tile)))
      .toArray();
    // if (legalTiles.length > 0) {
    //   this.board.fillTile(coord, player);
    //   this.score[player] -= 1;
    // }
    return legalTiles;
  }

  makeMove(coordOuter: HexCoordinates, coordInner: HexCoordinates) {
    const player = this.currentPlayerBlack ? "black" : "white";
    this.board.fillTile(coordOuter, player);
    this.score[player] -= 1;

    this.board.pushPiece(coordOuter, coordInner);
    const matches = this.board.checkAllRows();
    if (matches.length > 1) {
      return matches;
    } else {
      matches.forEach((matchedRow) => {
        const piecesToReturn = this.board.clearFills(...matchedRow);
        if (piecesToReturn.B > piecesToReturn.W) {
          this.score.black += piecesToReturn.B;
        } else {
          this.score.white += piecesToReturn.W;
        }
      });
    }
  }

  endTurn(): void {
    this.currentPlayerBlack = !this.currentPlayerBlack;
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
