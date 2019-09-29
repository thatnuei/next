import { createChannel } from "../channel/helpers"
import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import { StoreState } from "../store"

export const getCharacter = (name: string) => (state: StoreState) => {
  const char = state.characters[name] as Character | undefined
  return char || createCharacter(name)
}

export const getChannel = (id: string) => (state: StoreState) => {
  const channel = state.channels[id]
  return channel || createChannel(id)
}

export const getChatIdentity = () => (state: StoreState) => state.identity

// TODO
export const getCurrentRoom = () => (state: StoreState) => ({ type: "console" })

export const getAvailableChannels = () => (state: StoreState) =>
  state.availableChannels
