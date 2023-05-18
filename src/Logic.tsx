import { HexUtils } from 'react-hexgrid';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';

export const isClickable = (hex: HexCoordinates) => {
  return HexUtils.distance(hex, {q: 0, r: 0, s: 0}) > 3
}
