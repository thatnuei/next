import { AppModal } from "../app/types"
import { Channel, ChannelBrowserEntry } from "../channel/types"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import exists from "../common/helpers/exists"
import { Dictionary } from "../common/types"

type AppView = "login" | "characterSelect" | "chat"

type LoadingState = {
  loading: boolean
  error?: string
}

export type State = typeof state

export const state = {
  view: "login" as AppView,
  modal: undefined as AppModal | undefined,

  user: {
    account: "",
    ticket: "",
    characters: [] as string[],
    login: {
      loading: false,
    } as LoadingState,
  },

  // character data
  identity: "",
  characters: {} as Dictionary<Character>,

  get identityCharacter() {
    const characters = this.characters as Dictionary<Character>
    return characters[this.identity] || createCharacter(this.identity)
  },

  // channel data
  channels: {} as Dictionary<Channel>,

  availableChannels: {
    public: [] as ChannelBrowserEntry[],
    private: [] as ChannelBrowserEntry[],
  },

  get joinedChannels() {
    return Object.values(this.channels)
      .filter(exists)
      .filter((channel) => channel.memberNames.includes(this.identity))
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
