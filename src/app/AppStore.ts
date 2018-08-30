import { action, observable } from "mobx"
import { fetchCharacters, fetchTicket } from "../network/api"
import { loadAuthData } from "./storage"

export type AppScreen = "setup" | "login" | "selectCharacter"

export class AppStore {
  @observable
  account = ""

  @observable
  ticket = ""

  @observable
  characters: string[] = []

  @observable
  screen: AppScreen = "setup"

  @action
  setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters.sort()
  }

  @action
  setScreen(screen: AppScreen) {
    this.screen = screen
  }

  async submitLogin(account: string, password: string) {
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
}

export const appStore = new AppStore()
