const port = 3000;

const server = Bun.serve({
  port: port,
  websocket: {
    open(ws) {
      ws.subscribe("room");

      // remainingClients--;
      console.log(`${ws.data.name} connected`);

      // if (remainingClients === 0) {
      //   console.log("All clients connected");
      //   setTimeout(() => {
      //     console.log('Starting benchmark by sending "ready" message');
      //     ws.publishText("room", `ready`);
      //   }, 100);
      // }
    },
    message(ws, msg) {
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
          name: new URL(req.url).searchParams.get("name") || "Client #",
        },
      })
    )
      return;

    return new Response("Error");
  },
  });

console.log(`Waiting for some clients to connect...\n`, `  http://${server.hostname}:${port}/`);
