import { Derive } from "overmind"
import exists from "../common/helpers/exists"
import { Dictionary } from "../common/types"
import { createChannel } from "./helpers"
import { Channel, ChannelBrowserEntry } from "./types"

type ChannelState = {
  channels: Dictionary<Channel>
  getChannel: Derive<ChannelState, (id: string) => Channel>
  isJoined: Derive<ChannelState, (id: string) => boolean>
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

  fetchingPublicChannels: false,
  fetchingPrivateChannels: false,

  getChannel: (parent) => (id) =>
    (parent.channels[id] as Channel | undefined) || createChannel(id),

  isJoined: (parent, root) => (id) =>
    parent.getChannel(id).memberNames.includes(root.chat.identity),

  joinedChannels: (parent) => {
    return Object.values(parent.channels as Dictionary<Channel>)
      .filter(exists)
      .filter((channel) => parent.isJoined(channel.id))
  },

  get fetchingAvailableChannels() {
    return this.fetchingPublicChannels || this.fetchingPrivateChannels
  },
}
