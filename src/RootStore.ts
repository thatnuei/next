import * as idb from "idb-keyval"
import React, { useContext } from "react"
import ViewStore from "./app/ViewStore"
import ChannelStore from "./channel/ChannelStore"
import CharacterStore from "./character/CharacterStore"
import ChatStore from "./chat/ChatStore"
import SocketHandler from "./fchat/SocketHandler"
import FListApiService from "./flist/FListApiService"
import OverlayStore from "./overlay/OverlayStore"
import PrivateChatStore from "./private-chat/PrivateChatStore"

export default class RootStore {
  socketHandler = new SocketHandler()
  viewStore = new ViewStore(this)
  characterStore = new CharacterStore(this)
  channelStore = new ChannelStore(this)
  privateChatStore = new PrivateChatStore(this)
  chatStore = new ChatStore(this)
  overlayStore = new OverlayStore(this)

  constructor(public api = new FListApiService(), public storage = idb) {}

  init() {
    this.viewStore.createDocumentTitleReaction()
  }

  cleanup() {
    this.socketHandler.disconnect()
    this.viewStore.removeDocumentTitleReaction()
  }
}

export const RootStoreContext = React.createContext(new RootStore())

export const useRootStore = () => useContext(RootStoreContext)
