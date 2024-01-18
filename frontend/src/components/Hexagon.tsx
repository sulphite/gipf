import { Point } from "honeycomb-grid"
import { HexagonProps } from "./Board"

type PropsData = {
  data: HexagonProps;
}

export const Hexagon = ({ data }: PropsData) => {

  const formatPoints = (pointsarray: Point[]): string => {
    return pointsarray.map(coord => `${coord.x},${coord.y}`).join(" ")
  }

  const clickHandle = () => {
    console.log("click")
  }

  return (
    <g className="hexagon" onClick={clickHandle}>
      <polygon points={formatPoints(data.points)} />
    </g>
  )
}
