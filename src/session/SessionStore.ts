import { action, computed, observable } from "mobx"
import { appViewStore } from "../app/AppViewStore"
import { characterStore } from "../character/CharacterStore"
import { chatStore } from "../chat/ChatStore"
import { fetchCharacters, fetchTicket } from "../flist/api"
import { socketStore } from "../socket/SocketStore"
import { loadAuthData, saveAuthData } from "./storage"

export class SessionStore {
  @observable
  account = ""

  @observable
  ticket = ""

  @observable
  characters: string[] = []

  constructor() {
    socketStore.addCommandListener("IDN", () => {
      appViewStore.setScreen("chat")

      socketStore.sendCommand("JCH", { channel: "Frontpage" })
      socketStore.sendCommand("JCH", { channel: "Fantasy" })
      socketStore.sendCommand("JCH", { channel: "Story Driven LFRP" })
    })

    socketStore.addDisconnectListener(() => {
      alert("Disconnected from server :(")
      appViewStore.setScreen("login")
    })
  }

  @action
  setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters.sort()
  }

  async getApiTicket(account: string, password: string) {
    const { ticket, characters } = await fetchTicket(account, password)
    this.setUserData(account, ticket, characters)
  }

  async restoreUserData() {
    const { account, ticket } = loadAuthData()
    if (!account || !ticket) {
      throw new Error("Account or ticket not found in storage")
    }

    const { characters } = await fetchCharacters(account, ticket)
    this.setUserData(account, ticket, characters)
  }

  saveUserData() {
    saveAuthData(this.account, this.ticket)
  }

  @computed
  get identityCharacter() {
    return characterStore.getCharacter(chatStore.identity)
  }
}

export const sessionStore = new SessionStore()
