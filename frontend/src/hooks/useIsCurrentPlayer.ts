import { useContext } from "react";
import { CurrentPlayerContext } from "../contexts/Context";

export const useIsCurrentPlayer = () => {
  const { currentPlayer } = useContext(CurrentPlayerContext)
  return currentPlayer
}
