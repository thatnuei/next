import * as idb from "idb-keyval"
import { action, observable } from "mobx"
import { authenticate, fetchCharacters } from "../flist/api"

const credentialsKey = "credentials"

export default class UserStore {
  account = ""
  ticket = ""
  @observable.ref characters: string[] = []

  @action
  setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters
  }

  async restoreUserData() {
    const creds = await idb.get<
      { account: string; ticket: string } | undefined
    >(credentialsKey)

    if (!creds) {
      throw new Error("Auth credentials not found in storage")
    }

    const { account, ticket } = creds
    const { characters } = await fetchCharacters(account, ticket)
    this.setUserData(account, ticket, characters)
  }

  async submitLogin(account: string, password: string) {
    const { ticket, characters } = await authenticate(account, password)
    this.setUserData(account, ticket, characters)
    idb.set(credentialsKey, { account, ticket })
  }
}
