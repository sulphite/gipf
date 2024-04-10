import { Point } from "honeycomb-grid";
import { HexagonProps } from "./Board";
import { useContext } from "react";
import { wsMessengerContext } from "../Context";

type PropsData = {
  data: HexagonProps;
  handleSelect: (coord: string) => void;
  selected: boolean;
  clickable: boolean | undefined;
}

export const Hexagon = ({ data, handleSelect, selected, clickable }: PropsData) => {
  const sendFunc = useContext(wsMessengerContext)

  const formatPoints = (pointsarray: Point[]): string => {
    return pointsarray.map(coord => `${coord.x},${coord.y}`).join(" ")
  }

  const clickHandle = () => {
    if (data.outer && sendFunc) {
      handleSelect(data.coords)
      try {
        console.log(`sending ${data.coords} to backend`)
        sendFunc("place", {coord: data.coords})
        console.log("sent successfully")
      } catch (error: unknown) {
        console.error(error)
      }
    } else {
      console.log("clicked inner hex")
    }
  }

  const centerX = data.points.reduce((sum, vertex) => sum + vertex.x, 0) / 6
  const centerY = data.points.reduce((sum, vertex) => sum + vertex.y, 0) / 6
  const classes = `hexagon ${data.outer ? "outer" : ""} ${selected ? "selected" : ""} ${clickable ? "clickable" : ""}`

  return (
    <g className={classes} onClick={clickHandle}>
      <polygon points={formatPoints(data.points)} />
      {data.piece && <circle className={data.piece} cx={centerX} cy={centerY} r="25" />}
    </g>
  )
}
