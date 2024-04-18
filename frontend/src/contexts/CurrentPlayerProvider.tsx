import React, { ReactNode, useState } from "react";
import { CurrentPlayerContext } from "./Context";

interface currentPlayerProviderProps {
  children: ReactNode;
}

export const CurrentPlayerProvider: React.FC<currentPlayerProviderProps> = ({children}) => {
  const [currentPlayer, setCurrentPlayer] = useState<boolean>(false);

  return <CurrentPlayerContext.Provider value={ { currentPlayer, setCurrentPlayer } }> { children } </CurrentPlayerContext.Provider>;
};
