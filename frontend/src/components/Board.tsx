import { Point } from 'honeycomb-grid'
import { Hexagon } from "./Hexagon"

export type HexagonProps = {
  coords: string;
  points: Point[];
  piece?: string;
  isOuter: boolean;
  center?: Point;
}

export const Board = ({ hexes } ) => {

  // const Hex = defineHex({ dimensions: 50, origin: 'topLeft' })
  // const grid = new Grid(Hex, spiral({radius: 3}))

  // const hexagondata: HexagonProps[] = []

  // grid.forEach((hex) => {
  //   hexagondata.push({coords: hex.toString(), points: hex.corners, center: hex.center, piece: "B", isOuter: true})
  // })

  const hexdata: HexagonProps[] = hexes.map(hex => {
    return {
      coords: JSON.stringify({q: hex.q, r: hex.r}),
      points: hex.corners,
      piece: hex.fill,
      isOuter: true
    }
  })

  return (<svg
  className="grid"
  width="800"
  height="800"
  viewBox="-350 -250 800 600"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
>
  <g>
    {hexdata.map((h) => <Hexagon data={h} />)}
  </g>
</svg>)
}
