import { createCharacter } from "../character/helpers"
import { Character } from "../character/types"
import clamp from "../common/helpers/clamp"
import { Dictionary } from "../common/types"
import { ChatRoom } from "./chat/types"
import { UiMessage } from "./ui/types"

export type State = {
  view: "login" | "characterSelect" | "chat"
  user: {
    account: string
    ticket: string
    characters: string[]
  }
  login: {
    loading: boolean
    error?: string
  }
  characterSelect: {
    loading: boolean
    error?: string
  }
  chat: {
    identity: string
    characters: Dictionary<Character>
    updatingStatus: boolean
    readonly identityCharacter: Character

    rooms: ChatRoom[]
    currentRoomIndex: number
    readonly currentRoom: ChatRoom
  }
  uiMessages: UiMessage[]
}

export const state: State = {
  view: "login",
  user: {
    account: "",
    ticket: "",
    characters: [],
  },
  login: {
    loading: false,
  },
  characterSelect: {
    loading: false,
  },
  chat: {
    identity: "",
    characters: {},
    updatingStatus: false,
    get identityCharacter() {
      const { characters, identity } = this
      return characters[identity] || createCharacter(identity)
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
  },
  uiMessages: [],
}
