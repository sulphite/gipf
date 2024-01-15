import { defineHex, Grid, spiral, Point } from 'honeycomb-grid'
import { Hexagon } from "./Hexagon"

export type HexagonProps = {
  coords: string;
  points: Point[];
  piece?: string;
  isOuter: boolean;
}

export const Board = () => {

  const Hex = defineHex({ dimensions: 50, origin: 'topLeft' })
  const grid = new Grid(Hex, spiral({radius: 3}))

  const hexagondata: HexagonProps[] = []

  grid.forEach((hex) => {
    hexagondata.push({coords: hex.toString(), points: hex.corners, piece: "B", isOuter: true})
  })

  return (<svg
  className="grid"
  width="800"
  height="600"
  viewBox="-350 -250 800 600"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
>
  <g>
    {hexagondata.map((h) => <Hexagon data={h} />)}
  </g>
</svg>)
}
