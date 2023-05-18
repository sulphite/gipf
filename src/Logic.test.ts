import { test, expect } from "vitest"
import * as Logic from "./Logic"

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
