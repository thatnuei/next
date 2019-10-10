import { action, computed, observable } from 'mobx'
import RootStore from '../RootStore'

type ChatRoom = ChannelRoom | PrivateChatRoom
type ChannelRoom = { type: "channel"; id: string }
type PrivateChatRoom = { type: "privateChat"; partnerName: string }

export default class ChatNavigationStore {
  @observable.ref
  currentRoom?: ChatRoom

  constructor(private root: RootStore) { }

  @action
  showChannel = (id: string) => {
    this.currentRoom = { type: 'channel', id }
    this.root.chatOverlayStore.sidebarMenu.hide()
  }

  @computed
  get currentChannelId() {
    return this.currentRoom?.type === "channel"
      ? this.currentRoom.id
      : undefined
  }
}

