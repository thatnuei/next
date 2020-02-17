import { Channel, createChannel } from "../channel/types"
import { Character, createCharacter } from "../character/types"
import { Dict } from "../common/types"
import { createPrivateChat, PrivateChat } from "../privateChat/types"

export type ChatState = {
  characters: Dict<Character>
  channels: Dict<Channel>
  privateChats: Dict<PrivateChat>
}

export function getCharacter(state: ChatState, name: string) {
  return state.characters[name] ?? createCharacter(name)
}

export function getChannel(state: ChatState, id: string) {
  return state.channels[id] ?? createChannel(id)
}

export function getPrivateChat(state: ChatState, name: string) {
  return state.privateChats[name] ?? createPrivateChat(name)
}
