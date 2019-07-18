import { action, observable } from "mobx"
import RootStore from "../RootStore"

type Screen = { name: "login" } | { name: "characterSelect" } | { name: "chat" }

export default class ViewStore {
  @observable.ref
  screen: Screen = { name: "login" }

  constructor(private root: RootStore) {}

  @action
  showLogin() {
    this.screen = { name: "login" }
  }

  @action
  showCharacterSelect() {
    this.screen = { name: "characterSelect" }
  }

  @action
  showChat() {
    this.screen = { name: "chat" }
  }
}
