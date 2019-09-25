import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { StoreState } from "../store"

export const getCharacter = (name: string) => (state: StoreState) => {
  const char = state.characters[name] as Character | undefined
  return char || createCharacter(name)
}

export const getChatIdentity = () => (state: StoreState) => state.identity

// TODO
export const getCurrentRoom = () => (state: StoreState) => ({ type: "console" })
