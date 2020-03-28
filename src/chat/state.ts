import { ChannelState, createChannelState } from "../channel/state"
import { Character, createCharacter } from "../character/types"
import { Dict } from "../common/types"
import { Message } from "../message/types"
import { createPrivateChat, PrivateChat } from "../privateChat/types"

export type ChatState = {
  characters: Dict<Character>
  channels: Dict<ChannelState>
  privateChats: Dict<PrivateChat>
}

export function getCharacter(state: ChatState, name: string) {
  return state.characters[name] ?? createCharacter(name)
}

export function getChannel(state: ChatState, id: string) {
  return state.channels[id] ?? createChannelState(id)
}

export function getPrivateChat(state: ChatState, name: string) {
  return state.privateChats[name] ?? createPrivateChat(name)
}

export function getFullMessages(
  state: ChatState,
  messages: Message[],
): Message[] {
  return messages.map((it) => ({
    ...it,
    sender: getCharacter(state, it.senderName),
  }))
}

export function getCharactersFromNames(
  state: ChatState,
  names: string[],
): Character[] {
  return names.map(getCharacter.bind(null, state))
}
