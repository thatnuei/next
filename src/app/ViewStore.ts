import { action, observable } from "mobx"

type Screen =
  | { name: "console" }
  | { name: "channel"; channel: string }
  | { name: "privateChat"; partnerName: string }

type Modal = { name: "login" } | { name: "character-select" }

export default class ViewStore {
  @observable.ref
  screen: Screen = { name: "console" }

  @observable.ref
  modal?: Modal

  @action
  setScreen(screen: Screen) {
    this.screen = screen
  }

  @action
  showModal(modal: Modal) {
    this.modal = modal
  }

  @action
  clearModal() {
    this.modal = undefined
  }
}
