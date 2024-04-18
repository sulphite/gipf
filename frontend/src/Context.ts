import { createContext } from "react";

type messageFunction = (type: string, data: any) => void

export const wsContext = createContext<WebSocket | null>(null)
export const wsMessengerContext = createContext<messageFunction | null>(null)

export interface PlayerContextValue {
  currentPlayer: boolean;
  setCurrentPlayer: (player: boolean) => void;
  playerColor: string;
  setPlayerColor: (color: string) => void;
}

export const PlayerContext = createContext<PlayerContextValue>({
  currentPlayer: false,
  setCurrentPlayer: () => { },
  playerColor: "",
  setPlayerColor: () => { },
});
