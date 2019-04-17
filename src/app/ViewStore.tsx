import { action, observable } from "mobx"
import React from "react"
import ChatScreen from "../chat/ChatScreen"
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
      case "console":
        return <p>console</p>
      case "channel":
        return <p>channel</p>
      case "privateChat":
        return <p>privateChat</p>
    }
  }
}
