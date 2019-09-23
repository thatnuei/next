import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { Dictionary } from "../common/types"
import { Channel } from "./channelStore/types"

type RootState = {
  view: "login" | "characterSelect" | "chat"

  user: {
    account: string
    ticket: string
    characters: string[]

    login: {
      loading: boolean
      error?: string
    }
  }

  identity: string
  channels: Dictionary<Channel>
  characters: Dictionary<Character>

  updatingStatus: boolean
  connecting: boolean
  readonly identityCharacter: Character
}

export const state: RootState = {
  view: "login",

  user: {
    account: "",
    ticket: "",
    characters: [],
    login: {
      loading: false,
    },
  },

  // core chat data
  identity: "",
  channels: {},
  characters: {},

  // loading states
  updatingStatus: false,
  connecting: false,

  // derivations
  get identityCharacter() {
    const characters = this.characters as Dictionary<Character>
    return characters[this.identity] || createCharacter(this.identity)
  },
}
