import * as fchat from "fchat"
import { Derive } from "overmind"
import { createCharacter } from "../../character/helpers"
import { Character } from "../../character/types"
import clamp from "../../common/helpers/clamp"
import { Dictionary } from "../../common/types"

export type ChatState = {
  connecting: boolean

  identity: string
  identityCharacter: Derive<ChatState, Character>

  rooms: ChatRoom[]
  currentRoomIndex: number
  readonly currentRoom: ChatRoom
}

export type ChatRoomBase<T extends string> = {
  type: T
  id: string
  title: string
  messages: Message[]
  chatboxInput: string
  isUnread: boolean
}

export type ConsoleRoom = ChatRoomBase<"console">

export type ChannelRoom = ChatRoomBase<"channel"> & {
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  memberNames: string[]
  opNames: string[]
}

export type ChannelMode = fchat.Channel.Mode

export type Message = {
  id: string
  time: number
  senderName: string
  text: string
  type: MessageType
}

export type MessageType = "chat" | "lfrp" | "admin" | "system"

export type ChatRoom = ConsoleRoom | ChannelRoom

export const state: ChatState = {
  connecting: false,

  identity: "",
  identityCharacter: (state, { characterStore: character }) => {
    const characters = character.characters as Dictionary<Character>
    return characters[state.identity] || createCharacter(state.identity)
  },

  rooms: [
    {
      type: "console",
      id: "console",
      title: "Console",
      messages: [],
      chatboxInput: "",
      isUnread: false,
    },
  ],

  currentRoomIndex: 0,

  get currentRoom() {
    return this.rooms[clamp(this.currentRoomIndex, 0, this.rooms.length - 1)]
  },
}
