import { Derive } from "overmind"
import exists from "../common/helpers/exists"
import { Dictionary } from "../common/types"
import { Channel, ChannelBrowserEntry } from "./types"

type ChannelState = {
  channels: Dictionary<Channel>
  joinedChannels: Derive<ChannelState, Channel[]>

  availableChannels: {
    public: ChannelBrowserEntry[]
    private: ChannelBrowserEntry[]
  }
  fetchingPublicChannels: boolean
  fetchingPrivateChannels: boolean
  readonly fetchingAvailableChannels: boolean
}

export const state: ChannelState = {
  channels: {},

  availableChannels: {
    public: [],
    private: [],
  },

  joinedChannels: (parent, root) => {
    return Object.values(parent.channels as Dictionary<Channel>)
      .filter(exists)
      .filter((channel) => channel.memberNames.includes(root.chat.identity))
  },

  fetchingPublicChannels: false,
  fetchingPrivateChannels: false,

  get fetchingAvailableChannels() {
    return this.fetchingPublicChannels || this.fetchingPrivateChannels
  },
}
