import * as fchat from "fchat"
import clamp from "../../common/helpers/clamp"

type RoomBase<T extends string> = {
  type: T
  id: string
  title: string
  messages: Message[]
  chatboxInput: string
  isUnread: boolean
}

type ConsoleRoom = RoomBase<"console">

type ChannelRoom = RoomBase<"channel"> & {
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  memberNames: string[]
  opNames: string[]
}

type ChannelMode = fchat.Channel.Mode

type Message = {
  id: string
  time: number
  senderName: string
  text: string
  type: MessageType
}

type MessageType = "chat" | "lfrp" | "admin" | "system"

type Room = ConsoleRoom | ChannelRoom

type RoomStoreState = {
  rooms: Room[]
  currentRoomIndex: number
  readonly currentRoom: Room
}

const consoleRoom: ConsoleRoom = {
  type: "console",
  id: "console",
  title: "Console",
  messages: [],
  chatboxInput: "",
  isUnread: false,
}

export const state: RoomStoreState = {
  rooms: [consoleRoom],
  currentRoomIndex: 0,
  get currentRoom() {
    return this.rooms[clamp(this.currentRoomIndex, 0, this.rooms.length - 1)]
  },
}
