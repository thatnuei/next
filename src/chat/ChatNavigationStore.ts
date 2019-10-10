import { action, computed, observable } from 'mobx'

type ChatRoom = ChannelRoom | PrivateChatRoom
type ChannelRoom = { type: "channel"; id: string }
type PrivateChatRoom = { type: "privateChat"; partnerName: string }

export default class ChatNavigationStore {
  @observable.ref
  currentRoom?: ChatRoom

  @action
  showChannel = (id: string) => {
    this.currentRoom = { type: 'channel', id }
  }

  @computed
  get currentChannelId() {
    return this.currentRoom?.type === "channel"
      ? this.currentRoom.id
      : undefined
  }
}

