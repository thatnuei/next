import { action, computed, observable } from 'mobx'
import RootStore from '../RootStore'
import OverlayState from '../ui/OverlayState'

type ChatRoom = ChannelRoom | PrivateChatRoom
type ChannelRoom = { type: "channel"; id: string }
type PrivateChatRoom = { type: "privateChat"; partnerName: string }

export default class ChatNavigationStore {
  @observable.ref
  currentRoom?: ChatRoom

  sidebarMenu = new OverlayState()
  channelBrowser = new OverlayState()

  constructor(private root: RootStore) { }

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

  @action
  showChannelBrowser = () => {
    this.channelBrowser.show()
    this.root.channelStore.requestListings()
  }
}

