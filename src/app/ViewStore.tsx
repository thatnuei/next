import { action, observable } from "mobx"
import React from "react"
import ChannelView from "../channel/ChannelView"
import ChatScreen from "../chat/ChatScreen"
import RootStore from "../RootStore"
import CharacterSelectModal from "./CharacterSelectModal"
import LoginModal from "./LoginModal"

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
  private screen: Screen = { name: "init" }

  @observable.ref
  private chatRoom: ChatRoom = { name: "console" }

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

  renderScreen() {
    switch (this.screen.name) {
      case "init":
        return <p>Setting things up...</p>
      case "login":
        return <LoginModal />
      case "characterSelect":
        return <CharacterSelectModal />
      case "chat":
        return <ChatScreen />
    }
  }

  renderChatRoom() {
    switch (this.chatRoom.name) {
      case "console": {
        return <p>console</p>
      }

      case "channel": {
        const { channels } = this.root.channelStore
        const channel = channels.get(this.chatRoom.channel)
        return <ChannelView channel={channel} />
      }

      case "privateChat": {
        return <p>privateChat</p>
      }
    }
  }
}
