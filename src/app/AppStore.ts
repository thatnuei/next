import { action, observable } from "mobx"

type AppView = "login" | "characterSelect" | "chat"

export default class AppStore {
  @observable
  view: AppView = "login"

  @action
  showLogin = () => {
    this.view = "login"
  }

  @action
  showCharacterSelect = () => {
    this.view = "characterSelect"
  }

  @action
  showChat = () => {
    this.view = "chat"
  }
}
