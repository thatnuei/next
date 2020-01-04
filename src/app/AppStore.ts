import { observable } from "mobx"
import extractErrorMessage from "../common/helpers/extractErrorMessage"
import FListApi from "../flist/FListApi"
import StoredValue from "../storage/StoredValue"

type AppView = "loading" | "login" | "characterSelect" | "chat"

type UserData = { account: string; ticket: string; characters: string[] }

type LoginState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; error: string }

type SessionData = {
  account: string
  ticket: string
  identity: string
}

export class AppStore {
  @observable view: AppView = "loading"
  @observable.ref loginState: LoginState = { type: "idle" }
  @observable.ref userData?: UserData
  @observable identity = ""

  private readonly storedSession = new StoredValue<SessionData>(
    "session",
    StoredValue.session(),
  )

  constructor(private readonly api: FListApi) {}

  get session(): SessionData {
    return {
      account: this.userData?.account ?? "",
      ticket: this.userData?.ticket ?? "",
      identity: this.identity,
    }
  }

  get storedIdentity() {
    return new StoredValue<string>(`identity:${this.userData?.account ?? ""}`)
  }

  get loginLoading() {
    return this.loginState.type === "loading"
  }

  get loginError() {
    return this.loginState.type === "error" ? this.loginState.error : undefined
  }

  restoreSession = async () => {
    try {
      const session = await this.storedSession.get()
      if (!session) {
        this.view = "login"
        return
      }

      this.userData = {
        account: session.account,
        ticket: session.ticket,
        characters: [],
      }

      this.identity = session.identity
      this.view = "chat"
    } catch (error) {
      console.warn(error)
      this.view = "login"
    }
  }

  submitLogin = async (account: string, password: string) => {
    if (this.loginLoading) return
    this.loginState = { type: "loading" }

    try {
      const response = await this.api.login(account, password)
      const { ticket, characters } = response

      this.userData = { account, ticket, characters }
      this.identity = (await this.storedIdentity.get()) ?? characters[0]
      this.loginState = { type: "idle" }
      this.view = "characterSelect"
    } catch (error) {
      this.loginState = { type: "error", error: extractErrorMessage(error) }
    }
  }

  setIdentity = (identity: string) => {
    this.identity = identity
  }

  showLogin = () => {
    this.view = "login"
  }

  showChat = () => {
    this.storedSession.set(this.session)
    this.view = "chat"
  }

  handleSocketClosed = () => {
    this.loginState = { type: "error", error: "Disconnected from server" }
    this.view = "login"
  }

  handleConnectionError = () => {
    this.loginState = { type: "error", error: "Could not connect" }
    this.view = "login"
  }
}
