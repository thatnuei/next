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

  async restoreUserData() {
    const creds = await this.root.storage.get<
      { account: string; ticket: string } | undefined
    >(credentialsKey)

    if (!creds) {
      throw new Error("Auth credentials not found in storage")
    }

    const { account, ticket } = creds
    const { characters } = await this.root.api.fetchCharacters(account, ticket)
    this.setUserData(account, ticket, characters)
  }

  async submitLogin(account: string, password: string) {
    const { ticket, characters } = await this.root.api.authenticate(
      account,
      password,
    )
    this.setUserData(account, ticket, characters)
    this.root.storage.set(credentialsKey, { account, ticket })
  }
}
