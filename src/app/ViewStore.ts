import { action, autorun, computed, observable } from "mobx"
import RootStore from "../RootStore"

type Screen = { name: "login" } | { name: "characterSelect" } | { name: "chat" }

export default class ViewStore {
  @observable.ref
  screen: Screen = { name: "login" }

  removeDocumentTitleReaction = () => {}

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

  @computed
  private get documentTitle() {
    switch (this.screen.name) {
      case "login":
        return "Login - next"
      case "characterSelect":
        return "Select Character - next"
      case "chat":
        return `${this.root.chatStore.identity} - next`
      default:
        return "next"
    }
  }

  createDocumentTitleReaction() {
    this.removeDocumentTitleReaction = autorun(() => {
      document.title = this.documentTitle
    })
  }
}
