import { test, expect } from "vitest"
import * as Logic from "./Logic"


test("isClickable function exists", () => {
  // console.log(typeof(Logic.isClickable))
  expect(typeof(Logic.isClickable)).toBe("function")
})

test("isClickable returns boolean", () => {
  expect(Logic.isClickable({q: 4, r: -1, s: -3})).toBe(true);
  expect(Logic.isClickable({q: -3, r: 0, s: 3})).toBe(false);
 })
