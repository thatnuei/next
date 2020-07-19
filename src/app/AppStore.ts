import { observable } from "micro-observables"
import { SocketHandler } from "../socket/SocketHandler"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"
import { AuthenticateArgs, UserStore } from "./UserStore"

type AppScreen = "login" | "characterSelect" | "chat"

const storedIdentity = (account: string) =>
  createStoredValue(`${account}:identity`, v.string)

export class AppStore {
  readonly screen = observable<AppScreen>("login")
  readonly identity = observable("")

  constructor(
    private readonly socket: SocketHandler,
    private readonly userStore: UserStore,
  ) {}

  submitLogin = async (args: AuthenticateArgs) => {
    await this.userStore.login(args)

    const { account, characters } = this.userStore.userData.get()

    const identity = await storedIdentity(account)
      .get()
      .catch((error) => {
        console.warn("could not load stored identity", error)
        return undefined
      })

    this.identity.set(identity || characters[0])
    this.screen.set("characterSelect")
  }

  showLogin = () => {
    this.screen.set("login")
  }

  enterChat = (identity: string) => {
    const { account, ticket } = this.userStore.userData.get()

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

  leaveChat = () => {
    if (this.screen.get() === "chat") {
      this.socket.disconnect()
      this.screen.set("login")
    }
  }
}
