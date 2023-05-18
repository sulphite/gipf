import {test, expect } from "vitest"
//import { App } from "./App"

test("tests are running", () => {
  expect(true).toBe(true)
})

/*

game logic:

start of turn

check player has pieces remaining. if not, end game

player chooses a spot to place new piece.
only allow valid choices.

player chooses a direction to push the piece.

when a new piece is added in a direction, we push
all adjacent pieces one space along that direction
pushPieces(starthex,dir)

we check for lines of 4 same colour pieces
findLines() -> bool

  if they exist, we handle it with a separate function:

  if more than one line formed,
  allow player to choose which line to resolve

  remove captured pieces from game
  return line pieces to player

end of turn

*/
