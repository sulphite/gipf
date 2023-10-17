import { customAlphabet } from 'nanoid';
import { Room } from './Room';
import { ServerWebSocket } from 'bun';

const alphabet = '0123456789ABCDEFGHJ';
const nanoid = customAlphabet(alphabet, 4);

export class Lobby {
  rooms: {[key: string]: Room;};
  players: {[key: string]: ServerWebSocket<unknown>;};

  constructor() {
    this.rooms = {};
    this.players = {};
  }

  createRoom(): Room {
    const id = nanoid();
    const room: Room = new Room(id);
    this.rooms[id] = room;
    return room
  }

  addPlayer(name: string, ws: ServerWebSocket<unknown>) {
    this.players[name] = ws;
  }

  removePlayer(name:string) {
    delete this.players[name];
  }

  getOpenRoom() {
    const roomEntry = Object.entries(this.rooms).find((entry) => entry[1].isFull = false)
    return roomEntry ? roomEntry[1] : this.createRoom();
  }
}
