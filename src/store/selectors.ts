import { createChannel } from "../channel/helpers"
import { Channel } from "../channel/types"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { StoreState } from "../store"

export const getCharacter = (name: string) => (state: StoreState) => {
  const char = state.characters[name] as Character | undefined
  return char || createCharacter(name)
}

export const getChannel = (id: string) => (state: StoreState) => {
  const channel = state.channels[id] as Channel | undefined
  return channel || createChannel(id)
}

export const isChannelJoined = (id: string) => (state: StoreState) => {
  const channel = getChannel(id)(state)
  return channel.memberNames.includes(state.identity)
}

export const getChatIdentity = () => (state: StoreState) => state.identity

// TODO
export const getCurrentRoom = () => (state: StoreState) => ({ type: "console" })

export const getAvailableChannels = () => (state: StoreState) =>
  state.availableChannels

export const isChannelBrowserVisible = () => (state: StoreState) =>
  // overmind types are broken
  state.modal && (state.modal as { type: string }).type === "channelBrowser"
