import { action, observable } from "mobx"
import RootStore from "../RootStore"

type Screen =
  | { name: "init" }
  | { name: "login" }
  | { name: "characterSelect" }
  | { name: "chat" }

type ChatRoom =
  | { name: "console" }
  | { name: "channel"; channel: string }
  | { name: "privateChat"; partnerName: string }

export default class ViewStore {
  @observable.ref
  screen: Screen = { name: "init" }

  @observable.ref
  chatRoom: ChatRoom = { name: "console" }

  constructor(private root: RootStore) {}

  @action
  showLogin() {
    this.screen = { name: "login" }
  }

  @action
  showCharacterSelect() {
    this.screen = { name: "characterSelect" }
  }

  @action
  showChat() {
    this.screen = { name: "chat" }
  }

  @action
  showConsole() {
    this.chatRoom = { name: "console" }
  }

  @action
  showChannel(id: string) {
    this.chatRoom = { name: "channel", channel: id }
  }

  @action
  showPrivateChat(partnerName: string) {
    this.chatRoom = { name: "privateChat", partnerName }
  }

  isChannelActive(id: string) {
    return this.chatRoom.name === "channel" && this.chatRoom.channel === id
  }

  isPrivateChatActive(partnerName: string) {
    return (
      this.chatRoom.name === "privateChat" &&
      this.chatRoom.partnerName === partnerName
    )
  }
}
