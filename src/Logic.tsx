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

export const findDirection = (a: HexCoordinates, b: HexCoordinates) => {
  let dir = HexUtils.subtract(b,a);
  return HexUtils.DIRECTIONS.findIndex(x => HexUtils.equals(x, dir))
}

// function to return all hexes in that direction
// add the direction hex until distance = 4
export const getHexRow = (startHex: HexCoordinates, direction: number) => {
  let result: HexCoordinates[] = []
  let dir = HexUtils.DIRECTIONS[direction]

  let currentHex = HexUtils.add(startHex, dir)
  while (HexUtils.lengths(currentHex) < 4) {
    result.push(currentHex)
    currentHex = HexUtils.add(currentHex, dir)
  }
  return result
}
