import { HexUtils } from 'react-hexgrid';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';


export const isClickable = (hex: HexCoordinates) => {
  return HexUtils.lengths(hex) === 4
}

export const getValidNeighbors = (hex: HexCoordinates) => {
  let neighbors = HexUtils.neighbors(hex)
  return neighbors
}
