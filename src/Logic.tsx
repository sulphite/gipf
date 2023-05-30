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

const ROWSTARTPOINTS: number[][] = [[0,1,2,3,5,7,9],[1,2,3,4,6,8,10],
[5,7,9,11,13,15,17]]
const directions = [0,1,5]

/**
 * checks if a particular hex is in the outer ring.
 * @param hex - a hex coordinate
 * @returns boolean
 */
export const isClickable = (hex: HexCoordinates):boolean => {
  return HexUtils.lengths(hex) === 4
}

/**
 * get all pushable locations from a start hex
 * @param hex  hex on the outer ring
 * @returns array of pushable locations
 */
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

/**
 * from a start point and direction vector, creates an array of all hexes in that direction, not including outer ring.
 * @param startHex - a hex on the outer ring
 * @param direction - unit vector hex direction
 * @returns an array of hex coords
 */
export const getHexRow = (startHex: HexCoordinates, direction: HexCoordinates):HexCoordinates[] => {
  let result: HexCoordinates[] = []

  let currentHex = HexUtils.add(startHex, direction)
  while (HexUtils.lengths(currentHex) < 4) {
    result.push(currentHex)
    currentHex = HexUtils.add(currentHex, direction)
  }
  return result
}

/**
 * from am outer hex, returns all hexes in rows that are pushable to.
 * @param sourceHex - a hex coordinate on the outer ring
 * @param hexdata - full hex state data
 * @returns a flat array of hex coords
 */
export const getPushable = (sourceHex: HexCoordinates, hexdata: HexData[]):HexCoordinates[] => {
  let directions = getValidNeighbors(sourceHex).filter(x => isPushable(sourceHex,x,hexdata)).map(hex => findDirection(sourceHex,hex))
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
}

export const findLines = (hexdata: HexData[]) => {
  // create array of rows
  let outer = hexdata.filter(hex => isClickable(hex.coords))
  let rows = ROWSTARTPOINTS.map((arr,i) => {
    let dir = HexUtils.DIRECTIONS[directions[i]]
    return arr.map(num => {
      // let rowarray = getHexRow(outer[num].coords,dir);
      // console.log("data and first row element",outer[num].id, rowarray[0])
      return hexCoordsToHexData(getHexRow(outer[num].coords,dir),hexdata)
    })
  }).flat()
  return rows.filter(row => checkRow(row))

}

/**
 * returns the start and end index of the first instance of 4 consecutive same elements
 * @param row - array of hexdata
 * @returns an array of 2 indices, or false if not found
 */
export const checkRow = (row: HexData[]): [number,number] | boolean => {
  let start:number = 0;
  let end:number = 4;
  let slice: HexData[]
  let result: [number,number] | boolean = false
  while (end <= row.length) {
    slice = row.slice(start,end);
    if(slice.every(x => x.data.status === slice[0].data.status)) {
      result = [start,end];
      end += 1;
    } else {
      start += 1;
      end += 1;
    }
  }
  return result;
}
