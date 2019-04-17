import * as idb from "idb-keyval"
import React, { useContext } from "react"
import ViewStore from "./app/ViewStore"
import ChannelStore from "./channel/ChannelStore"
import CharacterStore from "./character/CharacterStore"
import ChatStore from "./chat/ChatStore"
import SocketStore from "./fchat/SocketStore"
import FListApiService from "./flist/FListApiService"
import PrivateChatStore from "./private-chat/PrivateChatStore"
import UserStore from "./user/UserStore"

export default class RootStore {
  socketStore = new SocketStore(this)
  viewStore = new ViewStore()
  userStore = new UserStore(this)
  characterStore = new CharacterStore()
  channelStore = new ChannelStore(this)
  privateChatStore = new PrivateChatStore(this)
  chatStore = new ChatStore(this)

  constructor(public api = new FListApiService(), public storage = idb) {}

  async init() {
    try {
      await this.userStore.restoreUserData()
      this.viewStore.showCharacterSelect()
    } catch (error) {
      console.warn("(non-fatal) user data restore error:", error)
      this.viewStore.showLogin()
    }
  }

  cleanup() {
    this.socketStore.disconnectFromChat()
  }
}

export const RootStoreContext = React.createContext(new RootStore())

export const useRootStore = () => useContext(RootStoreContext)
