import { action, computed, observable } from "mobx"
import { AppStore, SocketEventBus } from "../app/AppStore"
import { ServerCommands } from "../fchat/types"

export class ChatStore {
  @observable
  identity = ""

  @observable
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  @observable
  admins = new Map<string, true>()

  constructor(private root: AppStore, socketEvents: SocketEventBus) {
    socketEvents.listen("VAR", this.handleServerVariables)
    socketEvents.listen("ADL", this.handleAdminList)
  }

  @action.bound
  setIdentity(identity: string) {
    this.identity = identity
  }

  @computed
  get identityCharacter() {
    return this.root.characterStore.getCharacter(this.identity)
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
