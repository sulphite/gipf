import { HexUtils } from 'react-hexgrid';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';


export const isClickable = (hex: HexCoordinates) => {
  return HexUtils.lengths(hex) === 4
}
