import { test, expect, describe } from "vitest"
import * as Logic from "./Logic"
import { HexUtils } from "react-hexgrid"

const testCoord = {q: 1, r: 0, s: -1}
const testCoordOuter = {q: -4, r: 1, s: 3}

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

test("findDirection returns a direction in form of number", () => {
  expect(Logic.findDirection({q: 4, r: -1, s: -3},{q:3,r:0,s:-3})).toBe(4)
})

test("getHexRow returns array", () => {
  expect(Logic.getHexRow(testCoord,5)).toBeDefined()
  expect(Logic.getHexRow(testCoordOuter,0).length).toBeGreaterThan(0)
})

test("getHexRow returns correct array", () => {
  expect(Logic.getHexRow(testCoordOuter,0).length).toBe(6)
})

test("getPushable returns correct array", () => {
  expect(Logic.getPushable(testCoordOuter).length).toBe(10)
})
