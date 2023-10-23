export interface Message {
  type: "join" | "roomJoined" | "lobby" | "move";
  data: any;
}

export interface RoomJoinedData extends Message {
  type: "roomJoined";
  data: {room: string};
}

export interface JoinData extends Message {
  type: "join";
  data: {name: string};
}

export interface LobbyData extends Message {
  type: "lobby";
  data: {msg: string};
}

export interface MoveData extends Message {
  type: "move";
  data: {};
}
