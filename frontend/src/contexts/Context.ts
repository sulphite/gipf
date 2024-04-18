import { createContext } from "react";

type messageFunction = (type: string, data: any) => void

export const wsContext = createContext<WebSocket | null>(null)
export const wsMessengerContext = createContext<messageFunction | null>(null)

export interface PlayerContextValue {
  currentPlayer: boolean;
  setCurrentPlayer: (player: boolean) => void;
  playerColour: string;
  setPlayerColour: (color: string) => void;
}

export const PlayerContext = createContext<PlayerContextValue>({
  currentPlayer: false,
  setCurrentPlayer: () => { },
  playerColour: "",
  setPlayerColour: () => { },
});
