import { nanoid } from "nanoid";
import { Lobby } from "./src/Lobby";

const port = 3000;
const lobby = new Lobby();

const server = Bun.serve<{name: string;}>({
  port: port,
  websocket: {
    open(ws) {
      lobby.addPlayer(ws.data.name, ws);
      ws.subscribe("lobby")
      let connectionMessage = JSON.stringify({type: "lobby", data:`${ws.data.name} connected. ${Object.keys(lobby.players).length} players are here`})
      console.log(connectionMessage);
      ws.publishText("lobby", connectionMessage)
    },
    message(ws, msg: string) {
      const message = JSON.parse(msg);

      // join event
      if(message.type == "join") {
        let room = lobby.getOpenRoom();
        room.addSocket(ws);
        ws.unsubscribe("lobby");
        ws.subscribe(room.id);
        console.log(`added ${message.name} to room ${room.id}`)
        ws.send(JSON.stringify({ type: "roomJoined", room: room.id }))
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
