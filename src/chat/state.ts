import { Derive } from "overmind"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { Dictionary } from "../common/types"

type ChatState = {
  identity: string
  identityCharacter: Derive<ChatState, Character>
  updatingStatus: boolean
  connecting: boolean
  currentRoom?: ChatRoom
}

export type ChatRoom =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export const state: ChatState = {
  identity: "",

  identityCharacter: (state, root) => {
    const characters = root.character.characters as Dictionary<Character>
    return characters[state.identity] || createCharacter(state.identity)
  },

  updatingStatus: false,
  connecting: false,
}
