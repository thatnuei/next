import { observable } from "micro-observables"
import { SocketHandler } from "../socket/SocketHandler"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"
import { LoginResult } from "./Login"

type AppScreen = "login" | "characterSelect" | "chat"

const storedIdentity = (account: string) =>
  createStoredValue(`${account}:identity`, v.string)

export class AppStore {
  screen = observable<AppScreen>("login")

  userData = observable({
    account: "",
    ticket: "",
    characters: [] as string[],
  })

  identity = observable("")

  constructor(private readonly socket: SocketHandler) {}

  handleLoginSuccess = async (result: LoginResult) => {
    const identity = await storedIdentity(result.account)
      .get()
      .catch((error) => {
        console.warn("could not load stored identity", error)
        return undefined
      })

    this.userData.set(result)
    this.identity.set(identity || result.characters[0])
    this.screen.set("characterSelect")
  }

  enterChat = (identity: string) => {
    const { account, ticket } = this.userData.get()

    storedIdentity(account).set(identity)

    this.identity.set(identity)
    this.screen.set("chat")

    this.socket.connect({
      account,
      ticket,
      identity,
      onDisconnect: () => {
        this.screen.set("login")
      },
    })
  }

  showLogin = () => {
    this.screen.set("login")
  }
}
