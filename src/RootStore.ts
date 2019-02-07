import React, { useContext } from "react"
import ViewStore from "./app/ViewStore"
import ChannelStore from "./channel/ChannelStore"
import CharacterStore from "./character/CharacterStore"
import ChatStore from "./chat/ChatStore"
import SocketStore from "./fchat/SocketStore"
import UserStore from "./user/UserStore"

export default class RootStore {
  socketStore = new SocketStore(this)
  viewStore = new ViewStore(this)
  userStore = new UserStore()
  characterStore = new CharacterStore()
  channelStore = new ChannelStore(this)
  chatStore = new ChatStore(this)
}

export const RootStoreContext = React.createContext<RootStore>()

export function useRootStore() {
  const store = useContext(RootStoreContext)
  if (store == null) throw new Error("Root store provider not found")
  return store
}
