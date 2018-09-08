import { action, observable } from "mobx"
import { CommandListener, SocketStore } from "../fchat/SocketStore"

export class ChatStore {
  @observable
  identity = ""

  @observable.shallow
  serverVariables = new Map<string, number | string | ReadonlyArray<string>>()

  constructor(connection: SocketStore) {
    connection.addCommandListener("IDN", this.handleIdentified)
    connection.addCommandListener("VAR", this.handleServerVariables)
  }

  @action
  handleIdentified: CommandListener<"IDN"> = ({ character }) => {
    this.identity = character
  }

  @action
  handleServerVariables: CommandListener<"VAR"> = ({ variable, value }) => {
    this.serverVariables.set(variable, value)
  }
}
