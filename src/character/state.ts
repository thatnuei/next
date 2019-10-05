import { Derive } from "overmind"
import { Dictionary } from "../common/types"
import { createCharacter } from "./helpers"
import { Character } from "./types"

type CharacterState = {
  characters: Dictionary<Character>
  getCharacter: Derive<CharacterState, (name: string) => Character>
}

export const state: CharacterState = {
  characters: {},

  getCharacter: (state) => (name) =>
    (state.characters[name] as Character | undefined) || createCharacter(name),
}
