import { Point } from 'honeycomb-grid'
import { Hexagon } from "./Hexagon"
import { GridHexData } from "../../../backend/src/shared/types/gridhexdata"

export type HexagonProps = {
  coords: string;
  points: Point[];
  piece?: string;
  outer: boolean;
}

export const Board = ( {hexes}: {hexes: GridHexData[]} ) => {

  const hexagons = hexes.map((hex: GridHexData) => {
    return <Hexagon
    data={{
      coords: JSON.stringify({q: hex.q, r: hex.r}),
      points: hex.corners,
      piece: hex.fill,
      outer: hex.outer
    }} key={JSON.stringify({q: hex.q, r: hex.r})} />
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
    {hexagons}
  </g>
</svg>)
}
