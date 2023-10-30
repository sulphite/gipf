import { ServerWebSocket } from "bun";
import { Game } from "../logic/Game";

export class Room {
  id: string;
  sockets: ServerWebSocket<unknown>[];
  isFull: boolean;
  game: Game;
  gameStarted: boolean;

  constructor(id: string) {
    this.id = id;
    this.sockets = [];
    this.isFull = false;
    this.game = new Game();
    this.gameStarted = false;
  }

  addSocket(ws: ServerWebSocket<unknown>) {
    this.sockets.push(ws);
    if (this.sockets.length == 2) {
      this.isFull = true;
    }
  }
}