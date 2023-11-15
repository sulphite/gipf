import { customAlphabet } from "nanoid";
import { Room } from "./Room";
import { ServerWebSocket } from "bun";

const alphabet = "0123456789ABCDEFGHJ";
const nanoid = customAlphabet(alphabet, 4);

export class Lobby {
  rooms: { [key: string]: Room };
  players: { [key: string]: ServerWebSocket<{ name: string }> };

  constructor() {
    this.rooms = {};
    this.players = {};
  }

  createRoom(): Room {
    const id = nanoid();
    const room: Room = new Room(id);
    this.rooms[id] = room;
    return room;
  }

  addPlayer(name: string, ws: ServerWebSocket<{ name: string }>) {
    this.players[name] = ws;
  }

  removePlayer(name: string) {
    delete this.players[name];
  }

  getOpenRoom(): Room {
    const partiallyFilledRoom = Object.values(this.rooms).find(
      (room: Room) => room.isFull === false,
    );
    return partiallyFilledRoom ? partiallyFilledRoom : this.createRoom();
  }
}
