import { sortBy, toLower } from "lodash"
import { observable, runInAction } from "mobx"
import extractErrorMessage from "../common/helpers/extractErrorMessage"
import RootStore from "../RootStore"
import Reference from "../state/classes/Reference"
import { UserCredentials } from "./types"

type LoginState =
  | { type: "initial" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

export default class UserStore {
  @observable.ref
  loginState: LoginState = { type: "initial" }

  constructor(
    private root: RootStore,
    private credentials: Reference<UserCredentials>,
  ) {}

  submitLogin = async (account: string, password: string) => {
    runInAction(() => {
      this.loginState = { type: "loading" }
    })

    try {
      const response = await this.root.api.login(account, password)

      const { ticket, characters } = response

      runInAction(() => {
        this.credentials.set({
          account,
          ticket,
          characters: sortBy(characters, toLower),
        })
        this.loginState = { type: "success" }
      })

      this.root.appStore.showCharacterSelect()
      this.root.chatStore.setRelationsFromLoginResponse(response)
    } catch (error) {
      runInAction(() => {
        this.loginState = { type: "error", error: extractErrorMessage(error) }
      })
    }
  }
}
