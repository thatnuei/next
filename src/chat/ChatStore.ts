import { action, computed, observable } from "mobx"
import { characterStore } from "../character/CharacterStore"
import { CommandListener, socketStore } from "../socket/SocketStore"

export class ChatStore {
  @observable
  identity = ""

  @observable.shallow
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  constructor() {
    socketStore.addCommandListener("IDN", this.handleIdentified)
    socketStore.addCommandListener("VAR", this.handleServerVariables)
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
    return characterStore.getCharacter(this.identity)
  }
}

export const chatStore = new ChatStore()
