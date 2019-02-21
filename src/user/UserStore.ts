import * as idb from "idb-keyval"
import { action, observable } from "mobx"
import FListApiService from "../flist/FListApiService"

export const credentialsKey = "credentials"

export default class UserStore {
  account = ""
  ticket = ""
  @observable.ref characters: string[] = []

  constructor(private api = new FListApiService(), private storage = idb) {}

  @action
  private setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters
  }

  async restoreUserData() {
    const creds = await this.storage.get<
      { account: string; ticket: string } | undefined
    >(credentialsKey)

    if (!creds) {
      throw new Error("Auth credentials not found in storage")
    }

    const { account, ticket } = creds
    const { characters } = await this.api.fetchCharacters(account, ticket)
    this.setUserData(account, ticket, characters)
  }

  async submitLogin(account: string, password: string) {
    const { ticket, characters } = await this.api.authenticate(
      account,
      password,
    )
    this.setUserData(account, ticket, characters)
    this.storage.set(credentialsKey, { account, ticket })
  }
}
