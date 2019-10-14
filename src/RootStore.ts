import AppStore from "./app/AppStore"
import ChannelBrowserStore from "./channel/ChannelBrowserStore"
import ChannelStore from "./channel/ChannelStore"
import CharacterStore from "./character/CharacterStore"
import ChatNavigationStore from "./chat/ChatNavigationStore"
import ChatStore from "./chat/ChatStore"
import SocketStore from "./chat/SocketStore"
import FListApi from "./flist/FListApi"
import OverlayStore from "./overlay/OverlayStore"
import PrivateChatStore from "./private-chat/PrivateChatStore"
import UserStore from "./user/UserStore"

export default class RootStore {
  api = new FListApi()
  appStore = new AppStore()
  chatStore = new ChatStore(this)
  chatNavigationStore = new ChatNavigationStore(this)
  characterStore = new CharacterStore()
  channelStore = new ChannelStore(this)
  channelBrowserStore = new ChannelBrowserStore(this)
  privateChatStore = new PrivateChatStore(this)
  socketStore = new SocketStore()
  userStore = new UserStore(this)
  overlayStore = new OverlayStore()

  initialize() {
    this.chatStore.addSocketListeners()
  }
}
