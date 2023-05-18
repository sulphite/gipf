import { test, expect } from "vitest"
import * as Logic from "./Logic"

test("tests are running", () => {
  expect(true).toBe(true)
})

test("isClickable function exists", () => {
  console.log(typeof(Logic.isClickable))
  expect(typeof(Logic.isClickable)).toBe("function")
})
