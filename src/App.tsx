import { useState } from 'react';
import { HexGrid, Layout, Path, Text, Hexagon, HexUtils, GridGenerator } from 'react-hexgrid';
import './App.css';

const App = () => {
  const [hexagons, setHexagons] = useState(GridGenerator.hexagon(4));
  const [path, setPath] = useState({ start: null, end: null });

  const onClick = (event, source) => {
    if (path.start === null) {
      setPath({ start: source.state.hex, end: null });
    } else {
      setPath({ start: null, end: null });
    }
  };

  const onMouseEnter = (event, source) => {
    const targetHex = source.state.hex;

    // Color some hexagons
    const coloredHexagons = hexagons.map(hex => {
      hex.props = hex.props || {};
      // Highlight tiles that are next to the target (1 distance away)
      hex.props.className = HexUtils.distance(targetHex, hex) < 2 ? 'active' : '';

      // If the tile is on the same coordinate, add class specific to the coordinate name
      hex.props.className += targetHex.q === hex.q ? ' q ' : '';
      hex.props.className += targetHex.r === hex.r ? ' r ' : '';
      hex.props.className += targetHex.s === hex.s ? ' s ' : '';

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
        <Layout size={{ x: 6, y: 6 }} flat={false} spacing={1.1} origin={{ x: 0, y: 0 }}>
          { renderedhexes }
          <Path start={path.start} end={path.end} />
        </Layout>
      </HexGrid>
    </div>
  );
};

export default App;
