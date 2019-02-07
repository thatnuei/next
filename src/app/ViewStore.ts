import { action, computed, observable } from "mobx"
import RootStore from "../RootStore"

type Screen =
  | "login"
  | "characterSelect"
  | "console"
  | "channel"
  | "privateChat"

export default class ViewStore {
  @observable screen: Screen = "login"
  @observable currentChannelId = ""
  @observable currentPrivateChatName = ""

  constructor(private root: RootStore) {}

  @action
  showLogin() {
    this.screen = "login"
  }

  @action
  showCharacterSelect() {
    this.screen = "characterSelect"
  }

  @action
  showConsole() {
    this.screen = "console"
  }

  @action
  showChannel(channelId: string) {
    this.screen = "channel"
    this.currentChannelId = channelId
  }

  @action
  showPrivateChat(name: string) {
    this.screen = "privateChat"
    this.currentPrivateChatName = name
  }

  @computed
  get currentChannel() {
    return this.root.channelStore.channels.get(this.currentChannelId)
  }

  @computed
  get currentPrivateChat(): never {
    throw new Error("TODO")
  }
}
