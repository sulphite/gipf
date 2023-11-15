import { Direction } from "honeycomb-grid";

// Type definition for vector mapping direction to cube coordinates
export type Vector = {
  direction: Direction;
  q: number;
  r: number;
  s: number;
};

// Predefined vector values for each hexagonal direction
export const vectors: Vector[] = [
  { direction: Direction.NE, q: 1, r: -1, s: 0 },
  { direction: Direction.E, q: 1, r: 0, s: -1 },
  { direction: Direction.SE, q: 0, r: 1, s: -1 },
  { direction: Direction.SW, q: -1, r: 1, s: 0 },
  { direction: Direction.W, q: -1, r: 0, s: 1 },
  { direction: Direction.NW, q: 0, r: -1, s: 1 },
];
