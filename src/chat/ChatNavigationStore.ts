import { sortBy } from "lodash"
import { action, computed, observable } from "mobx"
import ChannelModel from "../channel/ChannelModel"
import { PrivateChatModel } from "../private-chat/PrivateChatModel"
import RootStore from "../RootStore"

type ChatRoomBase<T extends string> = { type: T; key: string }
type ChannelRoom = ChatRoomBase<"channel"> & { channel: ChannelModel }
type PrivateChatRoom = ChatRoomBase<"privateChat"> & { chat: PrivateChatModel }
type ChatRoom = ChannelRoom | PrivateChatRoom

const getChannelKey = (channelId: string) => `channel-${channelId}`
const getPrivateChatKey = (partnerName: string) => `private-chat-${partnerName}`

export default class ChatNavigationStore {
  @observable
  private currentRoomKey?: string

  constructor(private root: RootStore) {}

  @computed
  get channelRooms(): ChannelRoom[] {
    const sortedChannels = sortBy(
      this.root.channelStore.joinedChannels,
      (channel) => channel.name.toLowerCase(),
    )

    return sortedChannels.map((channel) => ({
      type: "channel",
      key: getChannelKey(channel.id),
      channel,
    }))
  }

  @computed
  get privateChatRooms(): PrivateChatRoom[] {
    const sortedChats = sortBy(
      this.root.privateChatStore.openChats,
      (chat) => chat.partner.toLowerCase(),
    )

    return sortedChats.map(chat => ({
      type: 'privateChat',
      key: getPrivateChatKey(chat.partner),
      chat,
    }))
  }

  @computed
  get rooms(): ChatRoom[] {
    return [...this.channelRooms, ...this.privateChatRooms]
  }

  @computed
  get currentRoom(): ChatRoom | undefined {
    const room = this.rooms.find((room) => room.key === this.currentRoomKey)
    return room || this.rooms[0]
  }

  @action
  setCurrentRoom = (key: string) => {
    this.currentRoomKey = key
    this.root.overlayStore.close('primaryNavigation')
    
    if (this.currentRoom?.type === 'channel') {
      this.currentRoom.channel.markRead()
    } else if (this.currentRoom?.type === 'privateChat') {
      this.currentRoom.chat.markRead()
    }
  }

  isCurrentChannel = (channelId: string) =>
    getChannelKey(channelId) === this.currentRoom?.key

  isCurrentPrivateChat = (partnerName: string) =>
    getPrivateChatKey(partnerName) === this.currentRoom?.key

  @computed
  get currentChannel() {
    return this.currentRoom?.type === "channel"
      ? this.currentRoom.channel
      : undefined
  }
}
