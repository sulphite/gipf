import { HexUtils } from 'react-hexgrid';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';

type HexData = {
  q: number,
  r: number,
  s: number,
  coords: {q: number,r: number,s: number},
  id: string,
  data: {status: string },
  className: string[]
}

/**
 * checks if a particular hex is in the outer ring.
 * @param hex - a hex coordinate
 * @returns boolean
 */
export const isClickable = (hex: HexCoordinates):boolean => {
  return HexUtils.lengths(hex) === 4
}

export const getValidNeighbors = (hex: HexCoordinates):HexCoordinates[] => {
  let neighbors = HexUtils.neighbors(hex).filter(x => HexUtils.lengths(x) === 3)
  return neighbors
}

/**
 * checks if a particular hex coordinate is included in an array.
 * @param arr an array of hex coordinates
 * @param hex a hex coordinate
 * @returns boolean
 */
export const hexIncludes = (arr: HexCoordinates[], hex: HexCoordinates):boolean => {
  return arr.some((ele: HexCoordinates) => HexUtils.equals(ele, hex))
}

export const findDirection = (a: HexCoordinates, b: HexCoordinates):number => {
  let dir = HexUtils.subtract(b,a);
  return HexUtils.DIRECTIONS.findIndex(x => HexUtils.equals(x, dir))
}

// function to return all hexes in that direction until outer ring
// add the direction hex until distance = 4
export const getHexRow = (startHex: HexCoordinates, direction: number):HexCoordinates[] => {
  let result: HexCoordinates[] = []
  let dir = HexUtils.DIRECTIONS[direction]

  let currentHex = HexUtils.add(startHex, dir)
  while (HexUtils.lengths(currentHex) < 4) {
    result.push(currentHex)
    currentHex = HexUtils.add(currentHex, dir)
  }
  return result
}

export const getPushable = (sourceHex: HexCoordinates):HexCoordinates[] => {
  let directions = getValidNeighbors(sourceHex).map(hex => findDirection(sourceHex,hex))
  return directions.map(d => getHexRow(sourceHex, d)).flat()
}

export const findHex = (id: string): HexCoordinates => {
  let coords = id.split(",").map(n => parseInt(n))
  return {q: coords[0], r: coords[1], s: coords[2]}
}

/**
 * checks that the target hex is a valid push location from start hex, and the target row has space to push to.
 * @param start - selected hex coordinate
 * @param target - target hex coord
 * @returns boolean
 */
export const isPushable = (start: HexCoordinates, target: HexCoordinates, hexdata: HexData[]):boolean => {
  return hexIncludes(getValidNeighbors(start), target)
}

const isEmpty = (hex: HexData):boolean => {
  return hex.data.status === ""
}

export const handlePushPiece = (start: HexCoordinates, target: HexCoordinates, hexdata: HexData[], whitePlayer: boolean): HexData[] => {
  let startID = HexUtils.getID(start)
  // shift all existing pieces in that row
  let row = getHexRow(start, findDirection(start, target)).map(coord => HexUtils.getID(coord))
  //find adjacent hexes containing pieces and push them

  //push the start piece
  // add status to target hex
  //remove status from start hex
  hexdata.map((hex: HexData) => {
    if(hex.id === HexUtils.getID(target)) {
      hex.data.status = whitePlayer ? "white" : "black"
    } else if(hex.id === startID) {
      hex.data.status = ""
    }
    return hex
  })
  return hexdata
}
