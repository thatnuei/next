import { action, observable } from "mobx"

export type AppScreen = "setup" | "login" | "selectCharacter" | "chat"

export class AppViewStore {
  @observable
  screen: AppScreen = "setup"

  @action
  setScreen(screen: AppScreen) {
    this.screen = screen
  }
}
