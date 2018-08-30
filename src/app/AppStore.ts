import { action, observable } from "mobx"
import { socketStore } from "../network/SocketStore"

export type AppScreen = "setup" | "login" | "selectCharacter" | "chat"

export class AppStore {
  @observable
  screen: AppScreen = "setup"

  setupListeners() {
    socketStore.addCommandListener("IDN", () => this.setScreen("chat"))

    socketStore.addDisconnectListener(() => {
      alert("Disconnected from server :(")
      this.setScreen("login")
    })
  }

  @action
  setScreen(screen: AppScreen) {
    this.screen = screen
  }
}

export const appStore = new AppStore()
