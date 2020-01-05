import { ChatNavigationStore } from "../chat/ChatNavigationStore.new"
import { RoomHeader, RoomIcon, RoomModel } from "../chat/RoomModel.new"
import { ChannelStore } from "./ChannelStore.new"
import { Channel } from "./types"

export class ChannelRoomModel extends RoomModel {
  constructor(
    store: ChatNavigationStore,
    private readonly channel: Channel,
    private readonly channelStore: ChannelStore,
  ) {
    super(store)
  }

  static createId = (channelId: string) => `channel:${channelId}`

  get roomId() {
    return ChannelRoomModel.createId(this.channel.id)
  }

  get title() {
    return this.channel.name
  }

  get icon(): RoomIcon {
    return { type: "public" }
  }

  get isUnread() {
    return this.channel.unread
  }

  get header(): RoomHeader {
    return { type: "channel", channel: this.channel }
  }

  get messages() {
    return this.channel.messages
  }

  get input() {
    return this.channel.input
  }

  get users() {
    return [...this.channel.users]
  }

  setInput = (input: string) => {
    this.channel.input = input
  }

  close = () => {
    this.channelStore.leave(this.channel.id)
  }
}
