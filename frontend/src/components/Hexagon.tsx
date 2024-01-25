import { Point } from "honeycomb-grid";
import { HexagonProps } from "./Board";
import { useContext } from "react";
import { wsMessengerContext } from "../Context";

type PropsData = {
  data: HexagonProps;
}

export const Hexagon = ({ data }: PropsData) => {
  // const socket: WebSocket | null = useContext(wsContext)
  const sendFunc = useContext(wsMessengerContext)

  const formatPoints = (pointsarray: Point[]): string => {
    return pointsarray.map(coord => `${coord.x},${coord.y}`).join(" ")
  }

  const clickHandle = () => {
    if (data.outer && sendFunc) {
      // console.log("sending coord to backend")
      // let message = JSON.stringify({type: "place", data: {room: "", coord: data.coords}})
      try {
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
  const classes = `hexagon ${data.outer ? "outer" : ""}`

  return (
    <g className={classes} onClick={clickHandle}>
      <polygon points={formatPoints(data.points)} />
      {data.piece && <circle className={data.piece} cx={centerX} cy={centerY} r="25" />}
    </g>
  )
}
