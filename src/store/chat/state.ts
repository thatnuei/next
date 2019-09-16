import { Derive } from "overmind"
import { createCharacter } from "../../character/helpers"
import { Character } from "../../character/types"
import { Dictionary } from "../../common/types"

export type ChatState = {
  connecting: boolean
  identity: string
  identityCharacter: Derive<ChatState, Character>
}

export const state: ChatState = {
  connecting: false,
  identity: "",
  identityCharacter: (state, { characterStore: character }) => {
    const characters = character.characters as Dictionary<Character>
    return characters[state.identity] || createCharacter(state.identity)
  },
}
