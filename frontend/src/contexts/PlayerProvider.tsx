import React, { ReactNode, useState, useEffect } from "react";
import { PlayerContext, PlayerContextValue } from "./Context";

interface PlayerProviderProps {
  children: ReactNode;
  initialCurrentPlayer: boolean | null;
  initialPlayerColour: string;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({
  children,
  initialCurrentPlayer,
  initialPlayerColour,
}) => {
  const [currentPlayer, setCurrentPlayer] = useState<boolean>(
    initialCurrentPlayer !== null ? initialCurrentPlayer : true
  );
  const [playerColour, setPlayerColour] = useState<string>(initialPlayerColour);

  useEffect(() => {
    // Update playerColor when initialPlayerColour changes
    // this is important so we don't get stuck with default ""
    setPlayerColour(initialPlayerColour);
  }, [initialPlayerColour]);

  const value: PlayerContextValue = {
    currentPlayer,
    setCurrentPlayer,
    playerColour,
    setPlayerColour,
  };

  return <PlayerContext.Provider value={ value }> { children } </PlayerContext.Provider>;
};
