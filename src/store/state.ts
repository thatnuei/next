import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { Dictionary } from "../common/types"

export type State = {
  view: "login" | "characterSelect" | "chat"
  user: {
    account: string
    ticket: string
    characters: string[]
  }
  login: {
    loading: boolean
    error?: string
  }
  characterSelect: {
    loading: boolean
    error?: string
  }
  chat: {
    identity: string
    characters: Dictionary<Character>
    updatingStatus: boolean
    readonly identityCharacter: Character
  }
}

export const state: State = {
  view: "login",
  user: {
    account: "",
    ticket: "",
    characters: [],
  },
  login: {
    loading: false,
  },
  characterSelect: {
    loading: false,
  },
  chat: {
    identity: "",
    characters: {},
    updatingStatus: false,
    get identityCharacter() {
      const { characters, identity } = this
      return characters[identity] || createCharacter(identity)
    },
  },
}
