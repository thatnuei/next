import { action, observable } from "mobx"
import { CharacterStore } from "../character/CharacterStore"
import { ChatStore } from "../chat/ChatStore"
import { fetchCharacters, fetchTicket } from "../network/api"
import { SocketConnectionHandler } from "../network/SocketStore"
import { UserState } from "../user/UserState"
import { loadAuthData, saveAuthData } from "./storage"

export type SessionScreen = "setup" | "login" | "selectCharacter" | "chat"

export class SessionState {
  user = new UserState()
  socket = new SocketConnectionHandler()
  chat = new ChatStore(this.socket)
  characters = new CharacterStore(this.socket)

  @observable
  screen: SessionScreen = "setup"

  constructor() {
    this.socket.addCommandListener("IDN", () => {
      this.setScreen("chat")
    })

    this.socket.addDisconnectListener(() => {
      alert("Disconnected from server :(")
      this.setScreen("login")
    })
  }

  @action
  setScreen(screen: SessionScreen) {
    this.screen = screen
  }

  async getApiTicket(account: string, password: string) {
    const { ticket, characters } = await fetchTicket(account, password)
    this.user.setUserData(account, ticket, characters)
  }

  async restoreUserData() {
    const { account, ticket } = loadAuthData()
    if (!account || !ticket) {
      throw new Error("Account or ticket not found in storage")
    }

    const { characters } = await fetchCharacters(account, ticket)
    this.user.setUserData(account, ticket, characters)
  }

  saveUserData() {
    saveAuthData(this.user.account, this.user.ticket)
  }
}
