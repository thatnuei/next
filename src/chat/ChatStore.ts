import { action, observable } from "mobx"
import { SocketEventBus } from "../app/AppStore"
import { ServerCommands } from "../fchat/types"

export class ChatStore {
  @observable
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  constructor(socketEvents: SocketEventBus) {
    socketEvents.listen("VAR", this.handleServerVariables)
  }

  @action.bound
  handleServerVariables({ variable, value }: ServerCommands["VAR"]) {
    this.serverVariables.set(variable, value)
  }
}
