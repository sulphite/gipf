import { HexCoordinates } from "honeycomb-grid";

export interface Message {
  type: "join" | "roomJoined" | "lobby" | "move";
  data: unknown;
}

export interface RoomJoinedData extends Message {
  type: "roomJoined";
  data: {
    room: string;
    playerColour: string;
    grid: string;
  };
}

export interface JoinData extends Message {
  type: "join";
  data: { name: string };
}

export interface LobbyData extends Message {
  type: "lobby";
  data: { msg: string };
}

export interface MoveData extends Message {
  type: "move";
  data: {
    room: string;
    coord: HexCoordinates;
    moveTo: HexCoordinates;
  };
}
