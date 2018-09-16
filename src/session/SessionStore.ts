import { action, observable } from "mobx"
import { RootStore } from "../app/RootStore"
import { CharacterStatus } from "../character/types"
import { authenticate, fetchCharacters } from "../flist/api"
import { loadAuthData, saveAuthData } from "./storage"

export class SessionStore {
  @observable
  account = ""

  @observable
  ticket = ""

  @observable
  characters: string[] = []

  constructor(private rootStore: RootStore) {
    rootStore.socketStore.addDisconnectListener(() => {
      alert("Disconnected from server :(")
    })
  }

  @action
  setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters.sort()
  }

  async getApiTicket(account: string, password: string) {
    const { ticket, characters } = await authenticate(account, password)
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

  updateStatus(status: CharacterStatus, statusmsg: string) {
    this.rootStore.socketStore.sendCommand("STA", { status, statusmsg })
  }
}
