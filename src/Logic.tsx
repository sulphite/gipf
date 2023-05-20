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

// function to return all hexes in that direction until outer ring
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

export const getPushable = (sourceHex: HexCoordinates) => {
  let directions = getValidNeighbors(sourceHex).map(hex => findDirection(sourceHex,hex))
  return directions.map(d => getHexRow(sourceHex, d)).flat()
}

export const findHex = (id: string) => {
  let coords = id.split(",").map(n => parseInt(n))
  return {q: coords[0], r: coords[1], s: coords[2]}
}

export const isPushable = (start: HexCoordinates, target: HexCoordinates) => {
  return hexIncludes(getValidNeighbors(start), target)
}

const isEmpty = (hex: any) => {
  return hex.data.status === ""
}

export const handlePushPiece = (start: HexCoordinates, target: HexCoordinates, hexdata: any, whitePlayer: boolean) => {
  let startID = HexUtils.getID(start)
  // shift all existing pieces in that row
  let row = getHexRow(start, findDirection(start, target)).map(coord => HexUtils.getID(coord))
  //find adjacent hexes containing pieces and push them

  //push the start piece
  // add status to target hex
  //remove status from start hex
  hexdata.map((hex: any) => {
    if(hex.id === HexUtils.getID(target)) {
      hex.data.status = whitePlayer ? "white" : "black"
    } else if(hex.id === startID) {
      hex.data.status = ""
    }
    return hex
  })
  return hexdata
}
