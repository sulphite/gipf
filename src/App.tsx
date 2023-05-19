import { useState } from 'react';
import { HexGrid, Layout, Path, Text, Hexagon, HexUtils, GridGenerator } from 'react-hexgrid';
import * as Logic from "./Logic";
import './App.css';
import { HexagonProps } from 'react-hexgrid/lib/Hexagon/Hexagon';

const initializeGrid = () => {
  return GridGenerator.hexagon(4).map(hex => {
    hex.props = hex.props || {}

    return hex
  })
}

const App = () => {
  // const hexagons = GridGenerator.hexagon(4)
  const [hexagons, setHexagons] = useState(initializeGrid());
  const [path, setPath] = useState({ start: null, end: null });
  const [hexagonData, setHexagonData] = useState(hexagons.map(hex => {
    return {
      q: hex.q,
      r: hex.r,
      s: hex.s,
      coords: {q: hex.q,r: hex.r,s: hex.s},
      id: HexUtils.getID({q: hex.q,r: hex.r,s: hex.s}),
      data: {status: "" },
      className: HexUtils.lengths({q: hex.q,r: hex.r,s: hex.s}) === 4 ? "outer" : ""
    }
  }));
  // const [gameState, setGameState] = useState({black: 15, white: 15});
  // const [currentPlayerWhite, setCurrentPlayerWhite] = useState(true);

  const onClick = (_event: any, source: { data?: any; state: any; props?: HexagonProps; }) => {
    // console.log(source.state.hex.props)
    // check if hex is clickable
    if(Logic.isClickable(source.state.hex)) {
      //colour pushable rows
      const pushable = Logic.getPushable(source.state.hex)
      const colouredHexagons = hexagonData.map(hex => {

        if (Logic.hexIncludes(pushable,hex.coords)) {
          hex.className += " pushable"
        }

        return hex
      })
      setHexagonData(colouredHexagons)

      // set path start/end
      if (path.start === null) {
        setPath({ start: source.state.hex, end: null });
      } else {
        setPath({ start: null, end: null });
      }}
  };

  const onMouseEnter = (_event: any, source: any) => {
    const targetHex = source.state.hex;

    // Color some hexagons
    const coloredHexagons = hexagonData.map(hex => {


      //highlight outer ring
      // hex.props.className = Logic.isClickable(hex) ? "outer" : ""

      // Highlight tiles that are next to the target (1 distance away)
      // hex.props.className += HexUtils.distance(targetHex, hex) < 1 ? ' active ' : '';
      // If the tile is on the same coordinate, add class specific to the coordinate name
      // hex.props.className += targetHex.q === hex.q ? ' q ' : '';
      // hex.props.className += targetHex.r === hex.r ? ' r ' : '';
      // hex.props.className += targetHex.s === hex.s ? ' s ' : '';

      return hex;
    });

    setPath({ start: path.start, end: targetHex });
    setHexagonData(coloredHexagons);
  };

  const renderedhexes = hexagonData.map((hex) => {
    console.log(hex)
    return (
    <Hexagon
      key={hex.id}
      q={hex.q}
      r={hex.r}
      s={hex.s}
      data={hex.data}
      className={hex.className}
      onMouseEnter={(e, h) => onMouseEnter(e, h)}
      onClick={(e, h) => onClick(e, h)}
    >
      <Text>{hex.id}</Text>
      {/* <circle className="black" r="3" /> */}
    </Hexagon>
  )})

  return (
    <div className="App">
      <h2>Pathfinding & active highlight</h2>
      <p>Click a tile to start drawing a path to your cursor. Click again to cancel.</p>
      <p>Hover around the board to see helper lines drawn.</p>
      <HexGrid width={1200} height={800}>
        <Layout size={{ x: 6, y: 6 }} flat={false} spacing={1} origin={{ x: 0, y: 0 }}>
          { renderedhexes }
          <Path start={path.start} end={path.end} />
        </Layout>
      </HexGrid>
    </div>
  );
};

export default App;
