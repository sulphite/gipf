import { test, expect } from "vitest"
import { HexGrid, Layout, Path, Text, Hexagon, HexUtils, GridGenerator } from 'react-hexgrid';


test("1 + 1", () => {
  expect(1+1).toEqual(2)
})

test("hexutils", () => {
  console.log(typeof(HexUtils))
  console.log(Object.getOwnPropertyNames(HexUtils.prototype))
})
