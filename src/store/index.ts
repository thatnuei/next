import { createOvermind, IConfig } from "overmind"
import { createHook } from "overmind-react"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { Dictionary } from "../common/types"
import { submitLogin } from "../flist/actions"
import { flist } from "../flist/effects"

type State = {
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
    readonly identityCharacter: Character
  }
}

const state: State = {
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

    get identityCharacter() {
      const { characters, identity } = this
      return characters[identity] || createCharacter(identity)
    },
  },
}

const config = {
  state,

  actions: {
    submitLogin,
  },

  effects: {
    flist,
  },
}

export function createAppStore() {
  return createOvermind(config)
}

export const useStore = createHook<typeof config>()

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
