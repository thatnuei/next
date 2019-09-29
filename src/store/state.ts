import { Channel, ChannelBrowserEntry } from "../channel/types"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { Dictionary } from "../common/types"

type State = {
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

  // core chat data
  identity: string
  characters: Dictionary<Character>
  channels: Dictionary<Channel>
  availableChannels: {
    public: ChannelBrowserEntry[]
    private: ChannelBrowserEntry[]
  }

  // loading states
  updatingStatus: boolean
  connecting: boolean

  // derivations
  readonly identityCharacter: Character
}

export const state: State = {
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
  availableChannels: {
    public: [],
    private: [],
  },

  // loading states
  updatingStatus: false,
  connecting: false,

  // derivations
  get identityCharacter() {
    const characters = this.characters as Dictionary<Character>
    return characters[this.identity] || createCharacter(this.identity)
  },
}
