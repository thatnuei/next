import AppStore from "./app/AppStore"
import ChannelStore from "./channel/ChannelStore"
import CharacterStore from "./character/CharacterStore"
import ChatNavigationStore from "./chat/ChatNavigationStore"
import ChatOverlayStore from "./chat/ChatOverlayStore"
import ChatStore from "./chat/ChatStore"
import SocketStore from "./chat/SocketStore"
import FListApi from "./flist/FListApi"
import UserStore from "./user/UserStore"

export default class RootStore {
  api = new FListApi()
  appStore = new AppStore()
  chatStore = new ChatStore(this)
  chatNavigationStore = new ChatNavigationStore(this)
  chatOverlayStore = new ChatOverlayStore()
  characterStore = new CharacterStore()
  channelStore = new ChannelStore(this)
  socketStore = new SocketStore()
  userStore = new UserStore(this)

  initialize() {
    this.chatStore.addSocketListeners()
  }
}
