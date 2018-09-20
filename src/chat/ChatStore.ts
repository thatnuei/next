import { action, observable } from "mobx"
import { SocketEventBus } from "../app/AppStore"
import { ServerCommands } from "../fchat/types"

export class ChatStore {
  @observable
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  @observable
  admins = new Map<string, true>()

  constructor(socketEvents: SocketEventBus) {
    socketEvents.listen("VAR", this.handleServerVariables)
    socketEvents.listen("ADL", this.handleAdminList)
  }

  @action.bound
  private handleServerVariables({ variable, value }: ServerCommands["VAR"]) {
    this.serverVariables.set(variable, value)
  }

  @action.bound
  private handleAdminList(params: ServerCommands["ADL"]) {
    this.admins.clear()
    for (const name of params.ops) {
      this.admins.set(name, true)
    }
  }
}
