import { Point } from "honeycomb-grid"
// import { HexagonProps } from "./Board"

export const Hexagon = ({ data }) => {
  console.log(data)

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
