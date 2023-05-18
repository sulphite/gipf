import { test, expect } from "vitest"
import * as Logic from "./Logic"
import { HexUtils } from "react-hexgrid"

const testCoord = {q: 1, r: 0, s: -1}

test("isClickable function exists", () => {
  // console.log(typeof(Logic.isClickable))
  expect(typeof(Logic.isClickable)).toBe("function")
})

test("isClickable returns boolean", () => {
  expect(Logic.isClickable({q: 4, r: -1, s: -3})).toBe(true);
  expect(Logic.isClickable({q: -3, r: 0, s: 3})).toBe(false);
 })

 test("getvalidNeighbors returns something", () => {
  expect(Logic.getValidNeighbors(testCoord)).toBeDefined()
 })

 test("getvalidNeighbors returns only 3rd ring hexes", () => {
  expect(Logic.getValidNeighbors({q: 4, r: -1, s: -3}).length).toBe(2)
 })

//  test("can check neighbors", () => {
//   console.log(HexUtils.direction(1))
//   console.log(HexUtils.neighbors(testCoord))
//   expect(HexUtils.neighbors(testCoord)).toContain(HexUtils.direction(1))
//  })

test("hexIncludes function works", () => {
  expect(Logic.hexIncludes(HexUtils.neighbors(testCoord),HexUtils.direction(1))).toBeDefined
  expect(Logic.hexIncludes(HexUtils.neighbors(testCoord),HexUtils.direction(1))).toBe(true)
})
