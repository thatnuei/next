import { action, observable } from "mobx"
import RootStore from "../RootStore"

type Screen =
  | { name: "init" }
  | { name: "login" }
  | { name: "characterSelect" }
  | { name: "console" }
  | { name: "channel"; channel: string }
  | { name: "privateChat" } // TODO

export default class ViewStore {
  @observable screen: Screen = { name: "init" }

  constructor(private root: RootStore) {}

  @action
  setScreen(screen: Screen) {
    this.screen = screen
  }
}
