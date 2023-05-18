import { MouseEvent, useState } from 'react';
import { HexGrid, Layout, Path, Text, Hexagon, HexUtils, GridGenerator } from 'react-hexgrid';
import * as Logic from "./Logic";
import './App.css';
import { HexagonProps } from 'react-hexgrid/lib/Hexagon/Hexagon';

const initializeGrid = () => {
  return GridGenerator.hexagon(4).map(hex => {
    hex.props = hex.props || {}
    hex.props.state = ""
    return hex
  })
}

const App = () => {
  const [hexagons, setHexagons] = useState(initializeGrid());
  const [path, setPath] = useState({ start: null, end: null });
  const [gameState, setGameState] = useState({black: 15, white: 15});
  const [currentPlayerWhite, setCurrentPlayerWhite] = useState(true);
  console.log(HexUtils.direction(1).props)


  const onClick = (_event: MouseEvent<SVGGElement, MouseEvent>, source: { data?: any; state: any; props?: HexagonProps; }) => {
    console.log(source.state.hex.props)
    // check if hex is clickable
    if(Logic.isClickable(source.state.hex)) {
      //colour pushable rows
      const colouredHexagons = hexagons.map(hex => {
        hex.props = hex.props || {};

        if (Logic.hexIncludes(Logic.getValidNeighbors(source.state.hex),hex)) {
          console.log(true)
          hex.props.className += " pushable"
        }

        return hex
      })
      setHexagons(colouredHexagons)

      // set path start/end
      if (path.start === null) {
        setPath({ start: source.state.hex, end: null });
      } else {
        setPath({ start: null, end: null });
      }}
  };

  const onMouseEnter = (_event, source) => {
    const targetHex = source.state.hex;

    // Color some hexagons
    const coloredHexagons = hexagons.map(hex => {
      hex.props = hex.props || {};

      //highlight outer ring
      hex.props.className = Logic.isClickable(hex) ? "outer" : ""

      // Highlight tiles that are next to the target (1 distance away)
      hex.props.className += HexUtils.distance(targetHex, hex) < 1 ? ' active ' : '';
      // If the tile is on the same coordinate, add class specific to the coordinate name
      // hex.props.className += targetHex.q === hex.q ? ' q ' : '';
      // hex.props.className += targetHex.r === hex.r ? ' r ' : '';
      // hex.props.className += targetHex.s === hex.s ? ' s ' : '';

      return hex;
    });

    setPath({ start: path.start, end: targetHex });
    setHexagons(coloredHexagons);
  };

  const renderedhexes = hexagons.map((hex, i) => {
    return (
    <Hexagon
      key={i}
      q={hex.q}
      r={hex.r}
      s={hex.s}
      className={hex.props ? hex.props.className : null}
      onMouseEnter={(e, h) => onMouseEnter(e, h)}
      onClick={(e, h) => onClick(e, h)}
    >
      <Text>{HexUtils.getID(hex)}</Text>
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
