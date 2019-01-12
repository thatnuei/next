import { action, observable } from "mobx"
import { authenticate, fetchCharacters } from "../flist/api"
import { sort } from "../helpers/sort"
import { StoredValue } from "../helpers/StoredValue"

type AuthCredentials = {
  account: string
  ticket: string
}

const storedCredentials = new StoredValue<AuthCredentials>("auth")

export class UserStore {
  @observable.ref
  credentials?: AuthCredentials

  @observable.ref
  characters: string[] = []

  @action
  setCredentials(credentials: AuthCredentials) {
    this.credentials = credentials
    storedCredentials.save(credentials)
  }

  @action
  setCharacters(characters: string[]) {
    this.characters = sort(characters)
  }

  async authenticate(account: string, password: string) {
    const { ticket, characters } = await authenticate(account, password)
    this.setCredentials({ account, ticket })
    this.setCharacters(characters)
  }

  async loadCredentials() {
    if (this.credentials) return this.credentials

    const credentials = await storedCredentials.load()
    if (!credentials) {
      throw new Error("Credentials not found in storage")
    }

    this.setCredentials(credentials)
    return credentials
  }

  async loadCharacters() {
    if (this.characters.length > 0) {
      return this.characters
    }

    const { account, ticket } = await this.loadCredentials()
    const { characters } = await fetchCharacters(account, ticket)

    this.setCharacters(characters)
  }
}
