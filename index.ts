import { Lobby } from "./src/Lobby";

const port = 3000;
const lobby = new Lobby();

const server = Bun.serve({
  port: port,
  websocket: {
    open(ws) {
      ws.subscribe("room");
      console.log(`${ws.data.name} connected`);
      lobby.addPlayer(ws.data.name, ws);

      console.log(`${Object.keys(lobby.players).length} players are here`)

      // if (remainingClients === 0) {
      //   console.log("All clients connected");
      //   setTimeout(() => {
      //     console.log('Starting benchmark by sending "ready" message');
      //     ws.publishText("room", `ready`);
      //   }, 100);
      // }
    },
    message(ws, msg: string) {
      const message = JSON.parse(msg);

      // join event
      if(message.type == "join") {
        let room = lobby.getOpenRoom();
        room.addSocket(ws);
        console.log(`added ${message.name} to room ${room.id}`)
      }

      const out = `${ws.data.name}: ${msg}`;
      console.log(out)
      if (ws.publishText("room", out) !== out.length) {
        throw new Error("Failed to publish message");
      }
    },
    close(ws) {
      // remainingClients++;
    },

    perMessageDeflate: false,
    publishToSelf: true,
  },

  fetch(req, server) {
    if (
      server.upgrade(req, {
        data: {
          name: new URL(req.url).searchParams.get("name") || "ClientName",
        },
      })
    )
      return;

    return new Response("Error");
  },
  });

console.log(`Waiting for some clients to connect...\n`, `  http://${server.hostname}:${port}/`);
