import { observable } from "mobx"
import extractErrorMessage from "../common/helpers/extractErrorMessage"
import FListApi from "../flist/FListApi"
import StoredValue from "../storage/StoredValue"

type AppView = "login" | "characterSelect" | "chat"

type UserData = { account: string; ticket: string; characters: string[] }

type LoginState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; error: string }

export class AppStore {
  @observable view: AppView = "login"
  @observable.ref loginState: LoginState = { type: "idle" }
  @observable.ref userData?: UserData
  @observable identity = ""

  constructor(private api: FListApi) {}

  get storedIdentity() {
    return new StoredValue<string>(`identity:${this.userData?.account ?? ""}`)
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

  get loginLoading() {
    return this.loginState.type === "loading"
  }

  get loginError() {
    return this.loginState.type === "error" ? this.loginState.error : undefined
  }

  setIdentity = (identity: string) => {
    this.identity = identity
  }

  showLogin = () => {
    this.view = "login"
  }

  showChat = () => {
    this.view = "chat"
  }

  get chatData() {
    return {
      account: this.userData?.account ?? "",
      ticket: this.userData?.ticket ?? "",
      identity: this.identity,
    }
  }
}
