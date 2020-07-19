import { observable } from "mobx"
import { SocketHandler } from "../socket/SocketHandler"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"
import { LoginResult } from "./Login"

type AppScreen = "login" | "characterSelect" | "chat"

const storedIdentity = (account: string) =>
  createStoredValue(`${account}:identity`, v.string)

export class AppStore {
  @observable screen: AppScreen = "login"
  @observable account = ""
  @observable ticket = ""
  @observable.ref characters: string[] = []
  @observable identity = ""

  constructor(private readonly socket: SocketHandler) {}

  handleLoginSuccess = async ({ account, ticket, characters }: LoginResult) => {
    const identity = await storedIdentity(account)
      .get()
      .catch((error) => {
        console.warn("could not load stored identity", error)
        return undefined
      })

    this.account = account
    this.ticket = ticket
    this.characters = characters
    this.identity = identity || characters[0]
    this.screen = "characterSelect"
  }

  enterChat = (identity: string) => {
    storedIdentity(this.account).set(identity)
    this.identity = identity
    this.screen = "chat"

    this.socket.connect({
      account: this.account,
      ticket: this.ticket,
      identity,
      onDisconnect: () => {
        this.screen = "login"
      },
    })
  }

  showLogin = () => {
    this.screen = "login"
  }
}
