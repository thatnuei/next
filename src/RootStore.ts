import AppStore from "./app/AppStore"
import ChannelBrowserStore from "./channel/ChannelBrowserStore"
import ChannelStore from "./channel/ChannelStore"
import CharacterStore from "./character/CharacterStore"
import ChatIdentity from "./chat/ChatIdentity"
import ChatNavigationStore from "./chat/ChatNavigationStore"
import ChatStore from "./chat/ChatStore"
import SocketStore from "./chat/SocketStore"
import FListApi from "./flist/FListApi"
import OverlayStore from "./overlay/OverlayStore"
import PrivateChatStore from "./private-chat/PrivateChatStore"
import { createEmptyUserCredentialsReference } from "./user/helpers"
import UserStore from "./user/UserStore"

export default class RootStore {
  api = new FListApi()
  userCredentials = createEmptyUserCredentialsReference()
  identity = new ChatIdentity(this.userCredentials)
  appStore = new AppStore()
  chatStore = new ChatStore(this, this.identity)
  chatNavigationStore = new ChatNavigationStore(this)
  characterStore = new CharacterStore(this, this.identity)
  channelStore = new ChannelStore(this, this.identity)
  channelBrowserStore = new ChannelBrowserStore(this)
  privateChatStore = new PrivateChatStore(this, this.identity)
  socketStore = new SocketStore()
  userStore = new UserStore(this, this.userCredentials)
  overlayStore = new OverlayStore()

  initialize() {
    this.chatStore.addSocketListeners()
  }
}
