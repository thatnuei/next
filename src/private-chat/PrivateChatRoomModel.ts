import { ChatNavigationStore } from "../chat/ChatNavigationStore.new"
import { RoomHeader, RoomIcon, RoomModel } from "../chat/RoomModel.new"
import { PrivateChat } from "./types"

export class PrivateChatRoomModel extends RoomModel {
  constructor(store: ChatNavigationStore, private readonly chat: PrivateChat) {
    super(store)
  }

  get roomId() {
    return `privateChat:${this.chat.partnerName}`
  }

  get title() {
    return this.chat.partnerName
  }

  get icon(): RoomIcon {
    return { type: "avatar", name: this.chat.partnerName }
  }

  get isUnread() {
    return this.chat.unread
  }

  get header(): RoomHeader {
    return { type: "character", name: this.chat.partnerName }
  }

  get input() {
    return this.chat.input
  }

  setInput = (input: string) => {
    this.chat.input = input
  }

  close = () => {
    this.navigation.removeRoom(this.roomId)
  }
}
