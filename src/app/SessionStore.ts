import { action, observable } from "mobx"
import { fetchCharacters, fetchTicket } from "../network/api"
import { loadAuthData, saveAuthData } from "./storage"

export class SessionStore {
  @observable
  account = ""

  @observable
  ticket = ""

  @observable
  characters: string[] = []

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

  async restoreSession() {
    const { account, ticket } = loadAuthData()
    if (!account || !ticket) {
      throw new Error("Account or ticket not found in storage")
    }

    const { characters } = await fetchCharacters(account, ticket)
    this.setUserData(account, ticket, characters)
  }

  saveSession() {
    saveAuthData(this.account, this.ticket)
  }
}

export const sessionStore = new SessionStore()
