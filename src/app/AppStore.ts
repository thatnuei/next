import { action, observable } from "mobx"

type AppView = "login" | "characterSelect" | "chat"

export type AppModal = { type: "channelBrowser" }

export default class AppStore {
  @observable
  view: AppView = "login"

  @observable
  modal?: AppModal

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

  @action
  setModal = (modal: AppModal) => {
    this.modal = modal
  }

  @action
  clearModal = () => {
    this.modal = undefined
  }
}
