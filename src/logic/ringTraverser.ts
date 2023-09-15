// Remove Hex constraint on T
import { HexCoordinates, RingOptions, RingFromRadiusOptions } from "honeycomb-grid";
import { Traverser } from "../types/grid";

export function ring<T>(options: RingOptions | RingFromRadiusOptions): Traverser<T> {

  return function ringTraverser(createTile: (coords?: HexCoordinates) => T, cursor?: HexCoordinates) {

    // Update createHex references to createTile
    let firstTile = createTile(options.start ?? cursor);

    let _cursor = createTile({/*...*/});

    const tiles: T[] = [];

    // Rest of implementation...

    return tiles;
  }

}

// Usage:

// const traverser: Traverser<ITile> = ring({/*...*/});
