import { action, observable } from "mobx"
import { CommandListener, SocketConnectionHandler } from "../network/SocketStore"

export class ChatState {
  @observable
  identity = ""

  @observable.shallow
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  constructor(socketStore: SocketConnectionHandler) {
    socketStore.addCommandListener("IDN", this.handleIdentified)
    socketStore.addCommandListener("VAR", this.handleServerVariables)
  }

  @action
  handleIdentified: CommandListener<"IDN"> = ({ character }) => {
    this.identity = character
    console.log(this)
  }

  @action
  handleServerVariables: CommandListener<"VAR"> = ({ variable, value }) => {
    this.serverVariables.set(variable, value)
  }
}
