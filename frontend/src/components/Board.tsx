import { Point } from 'honeycomb-grid'
import { Hexagon } from "./Hexagon"
import { GridHexData } from "../../../backend/src/shared/types/gridhexdata"
import { useState } from 'react';

export type HexagonProps = {
  coords: string;
  points: Point[];
  piece?: string;
  outer: boolean;
}

export const Board = ( {hexes, colour}: {hexes: GridHexData[]; colour: string} ) => {
  const [selected, setSelected ]  = useState<string | null>(null)
  console.log(selected)

  const handleSelect = (coord: string) => {
    if (selected) {
      setSelected(null)
    } else {
      setSelected(coord)
    }
  }

  const hexagons = hexes.map((hex: GridHexData) => {
    let thisIsSelected = selected == JSON.stringify({q: hex.q, r: hex.r});
    return <Hexagon
    data={{
      coords: JSON.stringify({q: hex.q, r: hex.r}),
      points: hex.corners,
      piece: thisIsSelected ? colour : hex.fill,
      outer: hex.outer
    }}
    handleSelect={handleSelect}
    key={JSON.stringify({q: hex.q, r: hex.r})}
    selected={thisIsSelected}
    clickable={hex.clickable} />
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
