import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHJ';
const nanoid = customAlphabet(alphabet, 4);

class Lobby {
  rooms;
  players;

  constructor() {
    this.rooms = {};
    this.players = {};
  }

  createRoom() {
    const id = nanoid();
    const room = new Room(id);
    rooms[id] = room;
    return room
  }
}
