import { Dictionary } from "../common/types"
import { Character } from "./types"

type CharacterState = {
  characters: Dictionary<Character>
}

export const state: CharacterState = {
  // character data
  characters: {},
}
