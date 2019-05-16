import { action, observable } from "mobx"
import RootStore from "../RootStore"

export const credentialsKey = "credentials"

export default class UserStore {
  account = ""
  ticket = ""
  @observable.ref characters: string[] = []

  constructor(private root: RootStore) {}

  @action
  private setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters
  }

  async submitLogin(account: string, password: string) {
    const { ticket, characters } = await this.root.api.authenticate(
      account,
      password,
    )
    this.setUserData(account, ticket, characters)
  }
}
