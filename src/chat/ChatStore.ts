import { action, computed, observable } from "mobx"
import { RootStore, rootStore } from "../app/RootStore"
import { CommandListener } from "../socket/SocketStore"

export class ChatStore {
  @observable
  identity = ""

  @observable.shallow
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  constructor(rootStore: RootStore) {
    rootStore.socketStore.addCommandListener("IDN", this.handleIdentified)
    rootStore.socketStore.addCommandListener("VAR", this.handleServerVariables)
  }

  @action
  handleIdentified: CommandListener<"IDN"> = ({ character }) => {
    this.identity = character
  }

  @action
  handleServerVariables: CommandListener<"VAR"> = ({ variable, value }) => {
    this.serverVariables.set(variable, value)
  }

  @computed
  get identityCharacter() {
    return rootStore.characterStore.getCharacter(this.identity)
  }
}
