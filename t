[1mdiff --git a/index.ts b/index.ts[m
[1mindex 2828f55..446fd6c 100644[m
[1m--- a/index.ts[m
[1m+++ b/index.ts[m
[36m@@ -8,19 +8,11 @@[m [mconst server = Bun.serve<{name: string;}>({[m
   port: port,[m
   websocket: {[m
     open(ws) {[m
[31m-      ws.subscribe("room");[m
[31m-      console.log(`${ws.data.name} connected`);[m
       lobby.addPlayer(ws.data.name, ws);[m
[31m-[m
[31m-      console.log(`${Object.keys(lobby.players).length} players are here`)[m
[31m-[m
[31m-      // if (remainingClients === 0) {[m
[31m-      //   console.log("All clients connected");[m
[31m-      //   setTimeout(() => {[m
[31m-      //     console.log('Starting benchmark by sending "ready" message');[m
[31m-      //     ws.publishText("room", `ready`);[m
[31m-      //   }, 100);[m
[31m-      // }[m
[32m+[m[32m      ws.subscribe("lobby")[m
[32m+[m[32m      let connectionMessage = JSON.stringify({type: "lobby", data:`${ws.data.name} connected. ${Object.keys(lobby.players).length} players are here`})[m
[32m+[m[32m      console.log(connectionMessage);[m
[32m+[m[32m      ws.publishText("lobby", connectionMessage)[m
     },[m
     message(ws, msg: string) {[m
       const message = JSON.parse(msg);[m
[36m@@ -29,6 +21,8 @@[m [mconst server = Bun.serve<{name: string;}>({[m
       if(message.type == "join") {[m
         let room = lobby.getOpenRoom();[m
         room.addSocket(ws);[m
[32m+[m[32m        ws.unsubscribe("lobby");[m
[32m+[m[32m        ws.subscribe(room.id);[m
         console.log(`added ${message.name} to room ${room.id}`)[m
         ws.send(JSON.stringify({ type: "roomJoined", room: room.id }))[m
       }[m
