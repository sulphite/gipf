import { createContext } from "react";

type messageFunction = (type: string, data: any) => void

export const wsContext = createContext<WebSocket | null>(null)
export const wsMessengerContext = createContext<messageFunction | null>(null)

export interface PlayerContextValue {
  playerColour: string;
  setPlayerColour: (color: string) => void;
}

export const PlayerContext = createContext<PlayerContextValue>({
  playerColour: "",
  setPlayerColour: () => { },
});

export interface CurrentPlayerContextValue {
  currentPlayer: boolean;
  setCurrentPlayer: (player: boolean) => void;
}

export const CurrentPlayerContext = createContext<CurrentPlayerContextValue>({
  currentPlayer: false,
  setCurrentPlayer: () => { }
})
