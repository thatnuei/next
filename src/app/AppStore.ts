import { action, observable } from "mobx"

export type AppScreen = "setup" | "login" | "selectCharacter"

export class AppStore {
  @observable
  screen: AppScreen = "setup"

  @action
  setScreen(screen: AppScreen) {
    this.screen = screen
  }
}

export const appStore = new AppStore()
