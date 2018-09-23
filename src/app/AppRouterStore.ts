import { action, observable } from "mobx"

export type AppRoute = "setup" | "login" | "characterSelect" | "connecting" | "chat"

export class AppRouterStore {
  @observable
  route: AppRoute = "setup"

  @action
  setRoute(route: AppRoute) {
    this.route = route
  }
}
