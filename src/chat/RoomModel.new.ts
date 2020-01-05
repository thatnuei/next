import { Channel } from "../channel/types"
import { Character } from "../character/types"
import { ChatNavigationStore } from "./ChatNavigationStore.new"

export type RoomIcon = { type: "public" } | { type: "avatar"; name: string }

export type RoomHeader =
  | { type: "channel"; channel: Channel }
  | { type: "character"; name: string }

export abstract class RoomModel {
  constructor(protected readonly navigation: ChatNavigationStore) {}

  abstract get roomId(): string
  abstract get title(): string
  abstract get icon(): RoomIcon
  abstract get isUnread(): boolean
  abstract get header(): RoomHeader

  abstract get input(): string
  abstract setInput(input: string): void

  abstract close(): void

  get users(): Character[] | undefined {
    return undefined
  }

  show = () => {
    this.navigation.setCurrentRoomId(this.roomId)
  }
}
