import { AppStore } from "../app/AppStore"
import { UserStore } from "../app/UserStore"
import { ChannelStore } from "../channel/ChannelStore"
import { ChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import { CharacterStore } from "../character/CharacterStore"
import { SocketHandler } from "../socket/SocketHandler"
import { StatusUpdateStore } from "../statusUpdate/StatusUpdateStore"

export class RootStore {
  readonly socket = new SocketHandler()
  readonly userStore = new UserStore()
  readonly appStore = new AppStore(this.socket, this.userStore)
  readonly characterStore = new CharacterStore(
    this.socket,
    this.userStore,
    this.appStore,
  )
  readonly channelStore = new ChannelStore(
    this.socket,
    this.userStore.userData,
    this.appStore.identity,
  )
  readonly channelBrowserStore = new ChannelBrowserStore(this.socket)
  readonly statusUpdateStore = new StatusUpdateStore(this.socket, this.appStore)
}
