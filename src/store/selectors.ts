import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { State } from "../store"

export const getCharacter = (name: string) => (state: State) => {
  const char = state.characters[name] as Character | undefined
  return char || createCharacter(name)
}

export const getChatIdentity = () => (state: State) => state.identity

// TODO
export const getCurrentRoom = () => (state: State) => ({ type: "console" })
