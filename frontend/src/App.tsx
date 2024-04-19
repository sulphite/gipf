import { ChangeEvent, useContext, useEffect, useState } from 'react'
import './App.css'
import { Board } from './components/Board';
import { CurrentPlayerContext, wsMessengerContext } from './contexts/Context';
import { PlayerProvider } from './contexts/PlayerProvider';
import { GridHexData } from '../../backend/src/shared/types/gridhexdata';

const wsAddress: string = "ws://localhost:3000";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [name, setName] = useState("")
  const [room, setRoom] = useState(null)
  const [hexes, setHexes] = useState<GridHexData[]>([])
  const [initialColour, setInitialColour] = useState<string>("")
  const { currentPlayer, setCurrentPlayer } = useContext(CurrentPlayerContext)
  console.log("current player", currentPlayer)

  useEffect(() => {
    // Connect to server
    const mysocket = new WebSocket(wsAddress);

    // Send message when connected
    mysocket.onopen = () => {
      console.log("socket: CONNECTED");
      setSocketConnected(true)
    }
    // Log messages from server
    mysocket.onmessage = msg => {
      const messageData = JSON.parse(msg.data)

      switch (messageData.type) {
        // on joining room, room and player colour are set
        // board is loaded
        // set current player to true
        case "roomJoined": {
          //console.log(messageData.data)
          setRoom(messageData.data.room)
          setInitialColour(messageData.data.playerColour)
          console.log("playercolour from backend",messageData.data.playerColour)
          let grid: GridHexData[] = JSON.parse(messageData.data.grid)
          setHexes(grid)
          if (messageData.data.playerColour == "B") {
            setCurrentPlayer(true)
          }
        }

          break;

        // when checking possible valid moves
        case "moveValidityResponse":
          console.log(messageData)
          if (messageData.data.valid) {
            const clickableTilesStringArray: string[] = messageData.data.tiles.map((tile: { q: number; r: number; fill: string }) => JSON.stringify({ q: tile.q, r: tile.r }))
            setHexes((prevHexes: GridHexData[]) => {
              const newHexes: GridHexData[] = prevHexes.map(hex => {
                if (clickableTilesStringArray.includes(JSON.stringify({ q: hex.q, r: hex.r }))) {
                  return { ...hex, clickable: true }
                } else {

                  return {...hex, clickable: false}
                }
              })
              return newHexes
            })

          }
          break;

        case "newTurn":
          console.log("got the turn end message")
          console.log(currentPlayer ? "my turn is over" : "its my turn now")
          setCurrentPlayer((prev:boolean) => !prev)
          break;

        case "update": {
          let grid: GridHexData[] = JSON.parse(messageData.data.grid)
          setHexes(grid)
        }
          break;

        //
        default:
          console.log("unknown message type", messageData)
          break;
      }

    }

    mysocket.onerror = (e) => {
      console.log(e)
      setSocketConnected(false)
    }

    mysocket.onclose = () => {
      console.log("closing connection")
      setSocketConnected(false)
    }
    setSocket(mysocket)

  }, [])

  const joinRoom = () => {
    if (socket) {
      console.log("trying to join a room")
      let message = JSON.stringify({ type: "join", data: { name: name } })
      socket.send(message)
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const sendSocketMessageWithRoom = (type: string, data: any): void => {
    if (socket) {
      socket.send(JSON.stringify({
        type: type,
        data: { ...data, room: room }
      }))
    } else {
      throw new Error("socket is not connected")
    }
  }

  const connectionStatusClass = socketConnected ? "connection connection-ok" : "connection connection-warn"

  return (
    <>
      <div className={connectionStatusClass} >{socketConnected ? "connected!" : "connecting to server..."}</div>
      <h1>Hello {name}!</h1>
      {room ?
        <h2>You're in room {room}</h2> :
        <div className="card">
          <input type="text" value={name} onChange={handleNameChange} placeholder='your name' />
          <button onClick={joinRoom} disabled={name == ""} >
            join room
          </button>
        </div>
      }
      <PlayerProvider initialPlayerColour={initialColour}>
      <div>{currentPlayer ? "Its your turn" : "Waiting for other player...." }</div>
        <wsMessengerContext.Provider value={sendSocketMessageWithRoom}>
          {hexes && <Board hexes={hexes} />}
        </wsMessengerContext.Provider>
      </PlayerProvider>
    </>
  )
}

export default App
