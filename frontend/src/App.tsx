import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'

const wsAddress: string = "ws://localhost:3000";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [name, setName] = useState("")
  const [room, setRoom] = useState(null)

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
      console.log("message", msg.data);
      const messageData = JSON.parse(msg.data)
      if(messageData.type == "roomJoined") {
        setRoom(messageData.data.room)
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
    if(socket) {
      console.log("trying to join a room")
      let message = JSON.stringify({type: "join", data: {name: name}})
      socket.send(message)
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const connectionStatusClass = socketConnected ? "connection connection-ok" : "connection connection-warn"

  return (
    <>
      <div className={connectionStatusClass} >{ socketConnected ? "connected!" : "connecting to server..." }</div>
      <h1>Hello {name}!</h1>
      { room ?
        <h2>You're in room {room}</h2> :
        <div className="card">
          <input type="text" value={name} onChange={handleNameChange} placeholder='your name'/>
          <button onClick={joinRoom} disabled={name == ""} >
            join room
          </button>
        </div>
      }
    </>
  )
}

export default App
