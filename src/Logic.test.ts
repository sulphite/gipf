import { test, expect, describe } from "vitest"
import * as Logic from "./Logic"
import { HexUtils, GridGenerator } from "react-hexgrid"
import { HexCoordinates } from "react-hexgrid/lib/models/Hex"

const testCoord: HexCoordinates = {q: 1, r: 0, s: -1}
const testCoordOuter: HexCoordinates = {q: -4, r: 1, s: 3}

const testHexDataFull = GridGenerator.hexagon(4).map(hex => {
  return {
    q: hex.q,
    r: hex.r,
    s: hex.s,
    coords: {q: hex.q,r: hex.r,s: hex.s},
    id: HexUtils.getID({q: hex.q,r: hex.r,s: hex.s}),
    data: {status: "white" },
    className: []
  }})
const testHexDataEmpty = testHexDataFull.map(hex => {
  return {...hex, data: {status: "" }}
})

describe("isClickable", () => {
  test("isClickable function exists", () => {
    // console.log(typeof(Logic.isClickable))
    expect(typeof(Logic.isClickable)).toBe("function")
  })

  test("isClickable returns boolean", () => {
    expect(Logic.isClickable({q: 4, r: -1, s: -3})).toBe(true);
    expect(Logic.isClickable({q: -3, r: 0, s: 3})).toBe(false);
   })
})

describe("getvalidneighbors", () => {
  test("getvalidNeighbors returns something", () => {
   expect(Logic.getValidNeighbors(testCoord)).toBeDefined()
  })

  test("getvalidNeighbors returns only 3rd ring hexes", () => {
   expect(Logic.getValidNeighbors({q: 4, r: -1, s: -3}).length).toBe(2)
  })
})

test("hexIncludes function works", () => {
  expect(Logic.hexIncludes(HexUtils.neighbors(testCoord),HexUtils.direction(1))).toBeDefined()
  expect(Logic.hexIncludes(HexUtils.neighbors(testCoord),HexUtils.direction(1))).toBe(true)
})

test("findDirection returns a direction as coords", () => {
  expect(Logic.findDirection({q: 4, r: -1, s: -3},{q:3,r:0,s:-3})).toStrictEqual(HexUtils.DIRECTIONS[4])
})

test("getHexRow returns array", () => {
  expect(Logic.getHexRow(testCoord,{q: 0, r: -1, s: 1})).toBeDefined()
  expect(Logic.getHexRow(testCoordOuter, {q: 1, r: -1, s: 0}).length).toBeGreaterThan(0)
})

test("getHexRow returns correct array", () => {
  expect(Logic.getHexRow(testCoordOuter,HexUtils.DIRECTIONS[0]).length).toBe(6)
})

test("getHexRow returns correct array, in the right order", () => {
  expect(Logic.getHexRow({q:3,r:1,s:-4},HexUtils.DIRECTIONS[3])[0]).toEqual({q:2,r:1,s:-3})
  expect(Logic.getHexRow(testCoordOuter,HexUtils.DIRECTIONS[0])[0]).toEqual({q:-3,r:1,s:2})
})

test("getPushable returns correct array", () => {
  expect(Logic.getPushable(testCoordOuter, testHexDataEmpty).length).toBe(10)
})

test("findHex returns hex coordinates", () => {
  expect(Logic.findHex("1,0,-1")).toBeDefined
  expect(Logic.findHex("1,0,-1")).toStrictEqual({q: 1, r: 0, s: -1})
})

describe("is it pushable", () => {



  const testHexDataMostlyFull = testHexDataFull.map(hex => {
    if(HexUtils.equals(hex.coords, {q: -2, r: -1, s: 3})) {
      return {...hex, data: {status: "" }}
    } else {return hex}
  })
  test("isPushable returns boolean", () => {
    expect(Logic.isPushable(testCoordOuter, testCoord, testHexDataFull)).toBeDefined()
    expect(Logic.isPushable(testCoordOuter, testCoord, testHexDataFull)).toBe(false)
  })

  test("isPushable returns true if coords are neighbours and row is empty", () => {
    expect(Logic.isPushable(testCoordOuter, {q:-3,r:0,s:3}, testHexDataEmpty)).toBe(true)
  })

  test("isPushable returns false if row is full", () => {
    expect(Logic.isPushable(testCoordOuter, {q:-3,r:0,s:3}, testHexDataFull)).toBe(false)
  })

  test("isPushable returns true if row has one space", () => {
    expect(Logic.isPushable(testCoordOuter, {q:-3,r:0,s:3}, testHexDataMostlyFull)).toBe(true)
  })
})

test("converting hex coords to data doesnt change the order, 3/0", () => {
  let row: HexCoordinates[] = Logic.getHexRow({q:3,r:1,s:-4},HexUtils.DIRECTIONS[3])
  expect(Logic.hexCoordsToHexData(row,testHexDataFull)[0].coords).toEqual(row[0])
  row.reverse()
  expect(Logic.hexCoordsToHexData(row,testHexDataFull)[0].coords).toEqual(row[0])
})

test("converting hex coords to data doesnt change the order, 2/5", () => {
  let row: HexCoordinates[] = Logic.getHexRow({q:1,r:3,s:-4},HexUtils.DIRECTIONS[2])
  expect(Logic.hexCoordsToHexData(row,testHexDataFull)[0].coords).toEqual(row[0])
  row.reverse()
  expect(Logic.hexCoordsToHexData(row,testHexDataFull)[0].coords).toEqual(row[0])
})

test("converting hex coords to data doesnt change the order, 1/4", () => {
  let row: HexCoordinates[] = Logic.getHexRow({q:-4,r:1,s:3},HexUtils.DIRECTIONS[1])
  expect(Logic.hexCoordsToHexData(row,testHexDataFull)[0].coords).toEqual(row[0])
  row.reverse()
  expect(Logic.hexCoordsToHexData(row,testHexDataFull)[0].coords).toEqual(row[0])
})
