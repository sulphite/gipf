import { useContext } from "react";
import { PlayerContext } from "../contexts/Context";

export const usePlayerColour = () => {
  const { playerColour } = useContext(PlayerContext)
  return playerColour
}
