export interface Message {
  type: "join" | "roomJoined" | "lobby";
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
