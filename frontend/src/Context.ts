import { createContext } from "react";

type messageFunction = (type: string, data: any) => void

export const wsContext = createContext<WebSocket | null>(null)
export const wsMessengerContext = createContext< messageFunction | null>(null)
