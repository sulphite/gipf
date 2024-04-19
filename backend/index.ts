import { nanoid } from "nanoid";
import { Lobby } from "./src/websocket/Lobby";
import {
  Message,
  JoinData,
  RoomJoinedData,
  LobbyData,
  MoveData,
  PlaceData,
} from "./src/shared/types/index";

const port = 3000;
const lobby = new Lobby();

const isJoinMessage = (msg: Message): msg is JoinData => {
  return msg.type === "join";
};

const isMoveMessage = (msg: Message): msg is MoveData => {
  return msg.type === "move";
};

const isPlaceMessage = (msg: Message): msg is PlaceData => {
  return msg.type === "place";
};

const server = Bun.serve<{ name: string }>({
  port: port,
  websocket: {
    open(ws) {
      lobby.addPlayer(ws.data.name, ws);
      ws.subscribe("lobby");
      let connectionMessage: LobbyData = {
        type: "lobby",
        data: {
          msg: `${ws.data.name} connected. ${
            Object.keys(lobby.players).length
          } players are here`,
        },
      };
      console.log(connectionMessage);
      ws.publishText("lobby", JSON.stringify(connectionMessage));
    },
    message(ws, msg: string) {
      const message: Message = JSON.parse(msg);

      // join a room
      if (isJoinMessage(message)) {
        let room = lobby.getOpenRoom();
        let playerColour = room.addSocket(ws);
        ws.unsubscribe("lobby");
        ws.subscribe(room.id);
        console.log(
          `added ${message.data.name} to room ${room.id} as player ${playerColour}`,
        );
        let response: RoomJoinedData = {
          type: "roomJoined",
          data: {
            room: room.id,
            playerColour,
            grid: room.game.board.serialise(),
          },
        };
        ws.send(JSON.stringify(response));
      }

      // placing a piece
      if (isPlaceMessage(message)) {
        console.log("Received place message", message.data);
        let room = lobby.rooms[message.data.room];
        if (room) {
          // place piece at coord
          const tiles = room.game.getPushableTiles(
            JSON.parse(message.data.coord),
          );
          // return legal tiles to push to
          let response = {
            type: "moveValidityResponse",
            data: {
              valid: tiles.length > 0,
              tiles: tiles,
            },
          };
          ws.send(JSON.stringify(response));
          // no need to update board until the move is confirmed
        }
      }

      // player makes a move
      if (isMoveMessage(message)) {
        console.log(message.data);
        // handle game move
        let room = lobby.rooms[message.data.room];
        if (room) {
          // place piece at coord
          let coordOuter = JSON.parse(message.data.coord);
          let coordInner = JSON.parse(message.data.moveTo);
          const matches = room.game.makeMove(coordOuter, coordInner);
          if (matches) {
            console.log("Matches", matches);
            // TODO: handle case of 2 simultaneous rows of 4
          }
          // publish update to whole room
          room.game.endTurn();
          room.sendBoardUpdate();
          room.broadcast({
            type: "newTurn",
            data: { score: room.game.score }
          })
        }
      }

      const out = `${ws.data.name}: ${msg}`;
      console.log(out);
    },
    close(ws) {
      lobby.removePlayer(ws.data.name);
      console.log(
        `${ws.data.name} left. ${
          Object.keys(lobby.players).length
        } players remain`,
      );
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

console.log(
  `Waiting for some clients to connect...\n`,
  `  http://${server.hostname}:${port}/`,
);
