import { action, computed, observable } from "mobx"
import RootStore from "../RootStore"

type Screen =
  | "setup"
  | "login"
  | "characterSelect"
  | "console"
  | "channel"
  | "privateChat"

export default class ViewStore {
  @observable screen: Screen = "setup"
  @observable currentChannelId = ""
  @observable currentPrivateChatName = ""

  constructor(private root: RootStore) {}

  @action
  showSetup() {
    this.screen = "setup"
  }

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
