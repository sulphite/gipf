import { HexUtils } from 'react-hexgrid';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';

type HexData = {
  q: number,
  r: number,
  s: number,
  coords: HexCoordinates,
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

/**
 * returns the direction FROM hex a TO hex b
 * @param a start hexcoordinate
 * @param b target hexcoordinate
 * @returns unit vector as hex coordinate
 */
export const findDirection = (a: HexCoordinates, b: HexCoordinates):HexCoordinates => {
  return HexUtils.subtract(b,a);
  // return HexUtils.DIRECTIONS.findIndex(x => HexUtils.equals(x, dir))
}

// function to return all hexes in that direction until outer ring
// add the direction hex until distance = 4
export const getHexRow = (startHex: HexCoordinates, direction: HexCoordinates):HexCoordinates[] => {
  let result: HexCoordinates[] = []
  // let dir = HexUtils.DIRECTIONS[direction]

  let currentHex = HexUtils.add(startHex, direction)
  while (HexUtils.lengths(currentHex) < 4) {
    result.push(currentHex)
    currentHex = HexUtils.add(currentHex, direction)
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
 * converts a collection of hexcoords to a collection of matching data.
 * @param arr an array of hex coordinates
 * @param hexdata full hexdata
 * @returns array of hexdata
 */
export const hexCoordsToHexData = (arr: HexCoordinates[], hexdata: HexData[]): HexData[] => {
  let data = hexdata.filter(hex => hexIncludes(arr, hex.coords))
  // filtering changes the order of the data.
  if(arr[0].q > arr[arr.length -1].q || arr[0].s < arr[arr.length -1].s) {
    data.reverse()
  }
  return data
}

/**
 * checks that the target hex is a valid push location from start hex, and the target row has space to push to.
 * @param start - selected hex coordinate
 * @param target - target hex coord
 * @returns boolean
 */
export const isPushable = (start: HexCoordinates, target: HexCoordinates, hexdata: HexData[]):boolean => {
  if (hexIncludes(getValidNeighbors(start), target)) {
    // get the row as hex coords and filter hexdata
    let row: HexData[] = hexCoordsToHexData(getHexRow(start,findDirection(start,target)), hexdata);
    return row.some(hex => isEmpty(hex));
  }
  return false
}

const isEmpty = (hex: HexData):boolean => {
  return hex.data.status === ""
}

const updateHex = (hex: HexData, replaceWith: HexData, hexdata: HexData[]):HexData[] => {
  return hexdata.map(h => {
    if (h.coords == hex.coords) {
      return replaceWith
    } else {return h}
  })
}

const pushPiece = (emptyhex: HexData, sourcehex: HexData, hexdata: HexData[]) => {
  let fill = sourcehex.data.status

  return updateHex(sourcehex, {...sourcehex, data: {status: ""}}, updateHex(emptyhex,{...emptyhex, data: {status: fill}},hexdata))
}

export const handlePushPiece = (start: HexCoordinates, target: HexCoordinates, hexdata: HexData[], whitePlayer: boolean): HexData[] => {
  let startID = HexUtils.getID(start)
  let data = hexdata
  // shift all existing pieces in that row
  let toBePushed: HexData[] = []
  let wholeRow = hexCoordsToHexData(getHexRow(start, findDirection(start, target)),hexdata)
  //find adjacent hexes containing pieces
  wholeRow.some(hex => {
    if(isEmpty(hex)) {
      toBePushed.push(hex);
      return true
    } else {
      toBePushed.push(hex);
      return false
    }
  })
  // reverse the array, to start from empty space
  toBePushed.reverse()
  //push them
  toBePushed.forEach((h, i, arr) => {
    if(i < toBePushed.length -1) {
      data = pushPiece(h, arr[i+1], data)
    }
  })
  //push the start piece
  // add status to target hex
  //remove status from start hex
  return data.map((hex: HexData) => {
    if(hex.id === HexUtils.getID(target)) {
      hex.data.status = whitePlayer ? "white" : "black"
    } else if(hex.id === startID) {
      hex.data.status = ""
    }
    return hex
  })
  return data
}
