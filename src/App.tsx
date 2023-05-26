import { useEffect, useState } from 'react';
import { HexGrid, Layout, Path, Text, Hexagon, HexUtils, GridGenerator } from 'react-hexgrid';
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
  // const [gameState, setGameState] = useState({black: 15, white: 15});
  const [currentPlayerWhite, setCurrentPlayerWhite] = useState(true);

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
      // pushPiece(Logic.findHex(selected),source.state.hex)
      // reset selected
      setSelected("")
      // check for gipfs
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
      <Text>{hex.id}</Text>
      {hex.data.status && <circle className={hex.data.status} r="3" />}
    </Hexagon>
  )})

  return (
    <div className="App">
      <HexGrid width={1200} height={800}>
        <Layout size={{ x: 6, y: 6 }} flat={false} spacing={1} origin={{ x: 0, y: 0 }}>
          { renderedhexes }
          {/* <Path start={path.start} end={path.end} /> */}
        </Layout>
      </HexGrid>
    </div>
  );
};

export default App;
