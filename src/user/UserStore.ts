import { sortBy, toLower } from "lodash"
import { observable, runInAction } from "mobx"
import extractErrorMessage from "../common/helpers/extractErrorMessage"
import RootStore from "../RootStore"

type LoginState =
  | { type: "initial" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

export default class UserStore {
  @observable
  account = ""

  @observable
  ticket = ""

  @observable.ref
  characters: string[] = []

  @observable.ref
  loginState: LoginState = { type: "initial" }

  constructor(private root: RootStore) {}

  submitLogin = async (account: string, password: string) => {
    runInAction(() => {
      this.loginState = { type: "loading" }
    })

    try {
      const { ticket, characters } = await this.root.api.login(
        account,
        password,
      )

      runInAction(() => {
        this.account = account
        this.ticket = ticket
        this.characters = sortBy(characters, toLower)
        this.loginState = { type: "success" }
      })

      this.root.appStore.showCharacterSelect()
      this.root.chatStore.restoreIdentity()
    } catch (error) {
      runInAction(() => {
        this.loginState = { type: "error", error: extractErrorMessage(error) }
      })
    }
  }
}
