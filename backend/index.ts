import { nanoid } from "nanoid";
import { Lobby } from "./src/websocket/Lobby";
import { Message, JoinData, RoomJoinedData, LobbyData, MoveData } from "./src/shared/types/index";

const port = 3000;
const lobby = new Lobby();

const isJoinMessage = (msg: Message): msg is JoinData => {
  return msg.type === 'join';
}

const isMoveMessage = (msg: Message): msg is MoveData => {
  return msg.type === 'move';
}

const server = Bun.serve<{ name: string; }>({
  port: port,
  websocket: {
    open(ws) {
      lobby.addPlayer(ws.data.name, ws);
      ws.subscribe("lobby")
      let connectionMessage: LobbyData = { type: "lobby", data: { msg: `${ws.data.name} connected. ${Object.keys(lobby.players).length} players are here` } }
      console.log(connectionMessage);
      ws.publishText("lobby", JSON.stringify(connectionMessage))
    },
    message(ws, msg: string) {
      const message: Message = JSON.parse(msg);

      // join a room
      if (isJoinMessage(message)) {
        let room = lobby.getOpenRoom();
        room.addSocket(ws);
        ws.unsubscribe("lobby");
        ws.subscribe(room.id);
        console.log(`added ${message.data.name} to room ${room.id}`)
        let response: RoomJoinedData = { type: "roomJoined", data: {
          room: room.id,
          playerColour: "1",
          grid: room.game.board.serialise()
        } }
        ws.send(JSON.stringify(response))
      }

      // player makes a move
      if (isMoveMessage(message)) {
        console.log(message.data)
        // handle game move
        let room = lobby.rooms[message.data.room];
        if (room) {
          // place piece at coord
          room.game.makeMove(message.data.coord, message.data.moveTo)
          // publish update to whole room
        }
      }

      const out = `${ws.data.name}: ${msg}`;
      console.log(out)
    },
    close(ws) {
      lobby.removePlayer(ws.data.name)
      console.log(`${ws.data.name} left. ${Object.keys(lobby.players).length} players remain`)
    },

    perMessageDeflate: false,
    publishToSelf: true,
  },

  fetch(req, server) {
    if (
      server.upgrade(req, {
        data: {
          name: nanoid(),
        },
      })
    )
      return;

    return new Response("Error");
  },
});

console.log(`Waiting for some clients to connect...\n`, `  http://${server.hostname}:${port}/`);
