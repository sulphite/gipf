import { nanoid } from "nanoid";
import { Lobby } from "./src/Lobby";
import { Message, JoinData, RoomJoinedData, LobbyData } from "./src/types/message";

const port = 3000;
const lobby = new Lobby();

const isJoinMessage = (msg: Message): msg is JoinData => {
  return msg.type === 'join';
}

const server = Bun.serve<{name: string;}>({
  port: port,
  websocket: {
    open(ws) {
      lobby.addPlayer(ws.data.name, ws);
      ws.subscribe("lobby")
      let connectionMessage: LobbyData = {type: "lobby", data:{msg: `${ws.data.name} connected. ${Object.keys(lobby.players).length} players are here`}}
      console.log(connectionMessage);
      ws.publishText("lobby", JSON.stringify(connectionMessage))
    },
    message(ws, msg: string) {
      const message: Message = JSON.parse(msg);

      // join a room
      if(isJoinMessage(message)) {
        let room = lobby.getOpenRoom();
        room.addSocket(ws);
        ws.unsubscribe("lobby");
        ws.subscribe(room.id);
        console.log(`added ${message.data.name} to room ${room.id}`)
        let response: RoomJoinedData = { type: "roomJoined", data: {room: room.id} }
        ws.send(JSON.stringify(response))
      }

      const out = `${ws.data.name}: ${msg}`;
      console.log(out)

      // if (ws.publishText("room", out) !== out.length) {
      //   throw new Error("Failed to publish message");
      // }
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
