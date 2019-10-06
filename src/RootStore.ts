import AppStore from "./app/AppStore"
import ChannelStore from "./channel/ChannelStore"
import CharacterStore from "./character/CharacterStore"
import ChatStore from "./chat/ChatStore"
import SocketStore from "./chat/SocketStore"
import FListApi from "./flist/FListApi"
import UserStore from "./user/UserStore"

export default class RootStore {
  api = new FListApi()
  appStore = new AppStore()
  chatStore = new ChatStore(this)
  characterStore = new CharacterStore()
  channelStore = new ChannelStore(this)
  socketStore = new SocketStore()
  userStore = new UserStore(this)

  initialize() {
    this.chatStore.addSocketListeners()
  }
}
