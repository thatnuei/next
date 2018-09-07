import { action, observable } from "mobx"

export class UserStore {
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
}
