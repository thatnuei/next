import { AppModal } from "../app/types"
import { Channel, ChannelBrowserEntry } from "../channel/types"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { Dictionary } from "../common/types"

type State = {
  view: "login" | "characterSelect" | "chat"
  modal?: AppModal

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
  readonly identityCharacter: Character

  // channel data
  channels: Dictionary<Channel>
  availableChannels: {
    public: ChannelBrowserEntry[]
    private: ChannelBrowserEntry[]
  }

  // loading states
  updatingStatus: boolean
  connecting: boolean
  fetchingPublicChannels: boolean
  fetchingPrivateChannels: boolean
  readonly fetchingAvailableChannels: boolean
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
  characters: {},

  get identityCharacter() {
    const characters = this.characters as Dictionary<Character>
    return characters[this.identity] || createCharacter(this.identity)
  },

  // channel data
  channels: {},
  availableChannels: {
    public: [],
    private: [],
  },

  // loading states
  updatingStatus: false,
  connecting: false,
  fetchingPublicChannels: false,
  fetchingPrivateChannels: false,

  get fetchingAvailableChannels() {
    return this.fetchingPublicChannels || this.fetchingPrivateChannels
  },
}
