import { HexUtils } from 'react-hexgrid';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';

const distFromOrigin = (hex: HexCoordinates) => {
  return HexUtils.distance(hex, {q: 0, r: 0, s: 0})
}

export const isClickable = (hex: HexCoordinates) => {
  return distFromOrigin(hex) === 4
}
