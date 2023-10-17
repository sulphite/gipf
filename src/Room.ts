import { ServerWebSocket } from "bun";

export class Room {
  id: string;
  sockets: ServerWebSocket[];
  isFull: boolean;

  constructor(id: string) {
    this.id = id;
    this.sockets = [];
    this.isFull = false
  }

  addSocket(ws: ServerWebSocket) {
    this.sockets.push(ws)
    if(this.sockets.length == 2) {
      this.isFull = true;
    }
  }

}
