import { action, observable } from "mobx"
import { fetchTicket } from "../network/api"

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
    this.characters = characters
  }

  @action
  setScreen(screen: AppScreen) {
    this.screen = screen
  }

  async submitLogin(account: string, password: string) {
    const { ticket, characters } = await fetchTicket(account, password)
    this.setUserData(account, ticket, characters.sort())
  }
}

export const appStore = new AppStore()
