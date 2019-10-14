import { sortBy } from "lodash"
import { action, computed, observable } from "mobx"
import ChannelModel from "../channel/ChannelModel"
import RootStore from "../RootStore"
import { primaryNavigationKey } from "./overlays"

type ChatRoomBase<T extends string> = { type: T; key: string }
type ChannelRoom = ChatRoomBase<"channel"> & { channel: ChannelModel }
type PrivateChatRoom = ChatRoomBase<"privateChat"> & { partnerName: string }
type ChatRoom = ChannelRoom | PrivateChatRoom

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
      key: `channel-${channel.id}`,
      channel,
    }))
  }

  // @computed
  get privateChatRooms(): PrivateChatRoom[] {
    return [] // TODO
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
    this.root.overlayStore.close(primaryNavigationKey)
  }

  isCurrentRoom = (key: string) => this.currentRoomKey === key

  @computed
  get currentChannel() {
    return this.currentRoom?.type === "channel"
      ? this.currentRoom.channel
      : undefined
  }
}
