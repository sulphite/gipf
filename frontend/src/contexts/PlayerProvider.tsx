import React, { ReactNode, useState, useEffect } from "react";
import { PlayerContext, PlayerContextValue } from "./Context";

interface PlayerProviderProps {
  children: ReactNode;
  initialPlayerColour: string;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({
  children,
  initialPlayerColour,
}) => {
  const [playerColour, setPlayerColour] = useState<string>(initialPlayerColour);

  useEffect(() => {
    // Update playerColor when initialPlayerColour changes
    // this is important so we don't get stuck with default ""
    setPlayerColour(initialPlayerColour);
  }, [initialPlayerColour]);

  const value: PlayerContextValue = {
    playerColour,
    setPlayerColour,
  };

  return <PlayerContext.Provider value={ value }> { children } </PlayerContext.Provider>;
};
