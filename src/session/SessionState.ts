import { action, computed, observable } from "mobx"
import { CharacterStore } from "../character/CharacterStore"
import { ChatState } from "../chat/ChatState"
import { SocketConnectionHandler } from "../fchat/SocketConnectionHandler"
import { fetchCharacters, fetchTicket } from "../flist/api"
import { UserState } from "../user/UserState"
import { loadAuthData, saveAuthData } from "./storage"

export type SessionScreen = "setup" | "login" | "selectCharacter" | "chat"

export class SessionState {
  user = new UserState()
  connection = new SocketConnectionHandler()
  chat = new ChatState(this.connection)
  characters = new CharacterStore(this.connection)

  @observable
  screen: SessionScreen = "setup"

  constructor() {
    this.connection.addCommandListener("IDN", () => {
      this.setScreen("chat")
    })

    this.connection.addDisconnectListener(() => {
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

  @computed
  get identityCharacter() {
    return this.characters.getCharacter(this.chat.identity)
  }
}
