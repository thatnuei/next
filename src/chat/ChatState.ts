import { action, observable } from "mobx"
import { CommandListener, SocketConnectionHandler } from "../network/SocketConnectionHandler"

export class ChatState {
  @observable
  identity = ""

  @observable.shallow
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  constructor(connection: SocketConnectionHandler) {
    connection.addCommandListener("IDN", this.handleIdentified)
    connection.addCommandListener("VAR", this.handleServerVariables)
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
