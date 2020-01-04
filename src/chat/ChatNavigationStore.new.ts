import { computed, observable } from "mobx"
import { ChannelStore } from "../channel/ChannelStore.new"
import { Channel } from "../channel/types"
import compareBy from "../common/helpers/compareBy"
import { PrivateChatStore } from "../private-chat/PrivateChatStore.new"
import { PrivateChat } from "../private-chat/types"

type ChannelRoom = { id: string; type: "channel"; channel: Channel }
type PrivateChatRoom = { id: string; type: "privateChat"; chat: PrivateChat }
type ChatRoom = ChannelRoom | PrivateChatRoom

export class ChatNavigationStore {
  constructor(
    private readonly channelStore: ChannelStore,
    private readonly privateChatStore: PrivateChatStore,
  ) {}

  @observable
  private currentRoomId?: string

  @computed
  get channelRooms(): ChannelRoom[] {
    const joinedChannels = this.channelStore.joinedChannels
      .slice()
      .sort(compareBy((it) => it.name.toLowerCase()))

    return joinedChannels.map((channel) => ({
      id: this.getChannelId(channel),
      type: "channel",
      channel,
    }))
  }

  @computed
  get privateChatRooms(): PrivateChatRoom[] {
    const joinedChats = this.privateChatStore.currentChats
      .slice()
      .sort(compareBy((it) => it.partnerName.toLowerCase()))

    return joinedChats.map((chat) => ({
      id: this.getPrivateChatId(chat),
      type: "privateChat",
      chat,
    }))
  }

  @computed
  get rooms(): ChatRoom[] {
    return [...this.channelRooms, ...this.privateChatRooms]
  }

  @computed
  get currentRoom(): ChatRoom | undefined {
    return (
      this.rooms.find((it) => it.id === this.currentRoomId) ?? this.rooms[0]
    )
  }

  showChannel = (channel: Channel) => {
    this.currentRoomId = this.getChannelId(channel)
  }

  showPrivateChat = (chat: PrivateChat) => {
    this.currentRoomId = this.getPrivateChatId(chat)
  }

  getChannelId = (channel: Channel) => `channel:${channel.id}`

  getPrivateChatId = (chat: PrivateChat) => `privateChat:${chat.partnerName}`
}
