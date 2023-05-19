import { HexUtils } from 'react-hexgrid';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';


export const isClickable = (hex: HexCoordinates) => {
  return HexUtils.lengths(hex) === 4
}

export const getValidNeighbors = (hex: HexCoordinates) => {
  let neighbors = HexUtils.neighbors(hex).filter(x => HexUtils.lengths(x) === 3)
  return neighbors
}

export const hexIncludes = (arr: HexCoordinates[], hex: HexCoordinates) => {
  return arr.some((ele: HexCoordinates) => HexUtils.equals(ele, hex))
}

export const findDirection = (a, b) => {
  let dir = HexUtils.subtract(b,a);
  return HexUtils.DIRECTIONS.findIndex(x => HexUtils.equals(x, dir))
}

// function to return all hexes in that direction
