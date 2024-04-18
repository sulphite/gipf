import { Point } from 'honeycomb-grid'
import { Hexagon } from "./Hexagon"
import { GridHexData } from "../../../backend/src/shared/types/gridhexdata"
import { useContext, useState } from 'react';
import { wsMessengerContext } from '../Context';

export type HexagonProps = {
  coords: string;
  points: Point[];
  piece?: string;
  outer: boolean;
}

export const Board = ({ hexes, colour }: { hexes: GridHexData[]; colour: string }) => {
  const [selected, setSelected] = useState<string | null>(null)
  const sendFunc = useContext(wsMessengerContext)

  const handleSelect = (coord: string) => {
    if (selected) {
      setSelected(null)
      // remove pulse from hexagons
    } else {
      setSelected(coord)
    }
  }

  const sendMove = (moveTo: string) => {
    if (sendFunc && selected) {
      sendFunc("move", { moveTo, coord: selected })
      setSelected(null)
    } else {
      throw new Error("no selected tile or socket error")
    }
  }

  const hexagons = hexes.map((hex: GridHexData) => {
    let thisIsSelected = selected == JSON.stringify({ q: hex.q, r: hex.r });
    return <Hexagon
      data={{
        coords: JSON.stringify({ q: hex.q, r: hex.r }),
        points: hex.corners,
        piece: thisIsSelected ? colour : hex.fill,
        outer: hex.outer
      }}
      handleSelect={handleSelect}
      handleSendMove={sendMove}
      key={JSON.stringify({ q: hex.q, r: hex.r })}
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
