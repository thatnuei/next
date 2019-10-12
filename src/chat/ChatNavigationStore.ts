import { action, computed, observable } from "mobx"
import clamp from "../common/helpers/clamp"
import RootStore from "../RootStore"

type ChatRoomBase<T extends string> = { type: T; key: string }
type ChannelRoom = ChatRoomBase<"channel"> & { channelId: string }
type PrivateChatRoom = ChatRoomBase<"privateChat"> & { partnerName: string }
type ChatRoom = ChannelRoom | PrivateChatRoom

export default class ChatNavigationStore {
  @observable
  currentRoomIndex = 0

  constructor(private root: RootStore) {}

  @computed
  get channelRooms(): ChannelRoom[] {
    return this.root.channelStore.joinedChannels.map((model) => ({
      type: "channel",
      key: `channel-${model.id}`,
      channelId: model.id,
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
    return this.rooms[clamp(this.currentRoomIndex, 0, this.rooms.length - 1)]
  }

  @action
  setCurrentRoom = (key: string) => {
    const index = this.rooms.findIndex((room) => room.key === key)
    if (index > -1) {
      this.currentRoomIndex = index
      this.root.chatOverlayStore.primaryNavigation.hide()
    }
  }
}
