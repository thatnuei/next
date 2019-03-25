import { action, observable } from "mobx"

type Screen =
  | { name: "init" }
  | { name: "login" }
  | { name: "characterSelect" }
  | { name: "console" }
  | { name: "channel"; channel: string }
  | { name: "privateChat"; partnerName: string }

export default class ViewStore {
  @observable.ref screen: Screen = { name: "init" }

  @action
  setScreen(screen: Screen) {
    this.screen = screen
  }
}
