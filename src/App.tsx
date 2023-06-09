import { useEffect, useState } from 'react';
import { HexGrid, Layout, Hexagon, HexUtils, GridGenerator } from 'react-hexgrid';
import * as Logic from "./Logic";
import './App.css';
import { HexagonProps } from 'react-hexgrid/lib/Hexagon/Hexagon';


const App = () => {
  const hexagons = GridGenerator.hexagon(4);
  // const [path, setPath] = useState({ start: null, end: null });
  const [selected, setSelected] = useState("")
  const [hexagonData, setHexagonData] = useState(hexagons.map(hex => {
    return {
      q: hex.q,
      r: hex.r,
      s: hex.s,
      coords: {q: hex.q,r: hex.r,s: hex.s},
      id: HexUtils.getID({q: hex.q,r: hex.r,s: hex.s}),
      data: {status: "" },
      className: HexUtils.lengths({q: hex.q,r: hex.r,s: hex.s}) === 4 ? ["outer"] : []
    }
  }));
  const [gameState, setGameState] = useState({black: 15, white: 15});
  const [currentPlayerWhite, setCurrentPlayerWhite] = useState(true);

  //check for game end at start of each turn
  useEffect(() => {
    if (currentPlayerWhite && gameState.white === 0) {
      window.alert("congrats! Black player wins")
    } else if (gameState.black === 0) {
      window.alert("congrats! White player wins")
    }
  },[currentPlayerWhite])

  // this effect adds .selected class to the selected hex
  useEffect(() => {
    setHexagonData(prev => prev.map(hex => {
        if(hex.id === selected) {
          hex.className.push("selected");
          hex.data.status = currentPlayerWhite ? "white" : "black"
        } else if (Logic.isClickable(hex.coords)) {
          hex.className = hex.className.filter(n => n !== "selected")
          hex.data.status = ""
        }
        return hex
    }));
    // colour pushable rows
    const pushable = selected ? Logic.getPushable(Logic.findHex(selected),hexagonData) : []
    const colouredHexagons = hexagonData.map(hex => {
      if (Logic.hexIncludes(pushable,hex.coords)) {
        hex.className.push("pushable")
      } else {
        hex.className = hex.className.filter(n => n !== "pushable")
      }
      return hex
    })
    setHexagonData(colouredHexagons)
  },[selected])

  // const pushPiece = (start: HexCoordinates, target: HexCoordinates) => {
  //   // shift all existing pieces in that row
  //   // add status to target hex

  //   //remove status from start hex
  // }

  const onClick = (_event: any, source: { data?: any; state: any; props?: HexagonProps; }) => {
    // check if hex is clickable; if yes we set selected and start path
    const targetHexID = HexUtils.getID(source.state.hex)
    if(Logic.isClickable(source.state.hex)) {
      // set selected hex
      setSelected(prev => {
        return (prev && prev === targetHexID) ? "" : targetHexID}
      )
      // set path start/end
      // if (path.start === null) {
      //   setPath({ start: source.state.hex, end: null });
      // } else {
      //   setPath({ start: null, end: null });
      // }

    // otherwise if there is a selected hex and we click a pushable space
    } else if(selected && Logic.isPushable(Logic.findHex(selected),source.state.hex, hexagonData)) {
      // push the piece
      let newhexes = Logic.handlePushPiece(Logic.findHex(selected),source.state.hex, hexagonData, currentPlayerWhite)
      setHexagonData(newhexes)
      setGameState(prev => {
        return currentPlayerWhite ? {...prev, white: prev.white - 1} : {...prev, black: prev.black - 1}
      })
      // reset selected
      setSelected("");
      // check for gipfs
      let lines = Logic.findLines(newhexes);
      lines.map(line => Logic.piecesToRemove(line)).forEach(line => {
        let total = Logic.countTotals(line)
        let newhexes = hexagonData.map(hex => {
          return line.map(x => x.id).includes(hex.id) ? {...hex, data: {status: ""} } : hex;
        })
        setHexagonData(newhexes);
        setGameState(prev => {
          return {black: prev.black + total.black, white: prev.white + total.white}
        })
      })
      // set current player
      setCurrentPlayerWhite(prev => !prev)
    }
  };

  // const onMouseEnter = (_event: any, source: any) => {
  //   const targetHex = source.state.hex;
  //   // Color some hexagons
  //   // const coloredHexagons = hexagonData.map(hex => {

  //     // If the tile is on the same coordinate, add class specific to the coordinate name
  //     // hex.props.className += targetHex.q === hex.q ? ' q ' : '';
  //     // hex.props.className += targetHex.r === hex.r ? ' r ' : '';
  //     // hex.props.className += targetHex.s === hex.s ? ' s ' : '';

  //   //   return hex;
  //   // });
  //   // setPath({ start: path.start, end: targetHex });
  //   // setHexagonData(coloredHexagons);
  // };

  const renderedhexes = hexagonData.map((hex) => {
    return (
    <Hexagon
      key={hex.id}
      q={hex.q}
      r={hex.r}
      s={hex.s}
      data={hex.data}
      className={hex.className.join(" ")}
      // onMouseEnter={(e, h) => onMouseEnter(e, h)}
      onClick={(e, h) => onClick(e, h)}
    >
      {/* <Text>{hex.id}</Text> */}
      {hex.data.status && <circle className={hex.data.status} r="3" />}
    </Hexagon>
  )})

  return (
    <div className="App">
      <div className='game'>
        <div className='player-area pieces--white'>
          <span>Player White</span>
          {currentPlayerWhite && gameState.white > 0 && <p>Your Turn!</p>}
          <div className='pieces-container'>
          { [...Array(gameState.white)].map(_ele => <div className='piece white'></div>) }
            <strong>{gameState.white}</strong>
          </div>
        </div>
        <HexGrid width={800} height={750}>
          <Layout size={{ x: 6, y: 6 }} flat={false} spacing={1} origin={{ x: 0, y: 0 }}>
            { renderedhexes }
            {/* <Path start={path.start} end={path.end} /> */}
          </Layout>
        </HexGrid>
        <div className='player-area pieces--black'>
          <span>Player Black</span>
          {!currentPlayerWhite && gameState.black > 0 && <p>Your Turn!</p>}
          <div className='pieces-container'>
          { [...Array(gameState.black)].map(_ele => <div className='piece black'></div>) }
          <strong>{gameState.black}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
