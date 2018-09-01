import { action, observable } from "mobx"
import { CommandListener, SocketConnectionHandler } from "../fchat/SocketConnectionHandler"
import { CharacterModel } from "./CharacterModel"

export class CharacterStore {
  characters = observable.map<string, CharacterModel>()

  constructor(connection: SocketConnectionHandler) {
    connection.addCommandListener("LIS", this.handleInitialCharacterData)
    connection.addCommandListener("NLN", this.handleLogin)
    connection.addCommandListener("FLN", this.handleLogout)
    connection.addCommandListener("STA", this.handleStatus)
  }

  @action
  getCharacter(name: string) {
    const char = this.characters.get(name) || new CharacterModel(name, "None", "offline")
    this.characters.set(name, char)
    return char
  }

  @action
  private handleInitialCharacterData: CommandListener<"LIS"> = ({ characters }) => {
    for (const [name, gender, status, statusMessage] of characters) {
      const character = this.getCharacter(name)
      character.gender = gender
      character.status = status
      character.statusMessage = statusMessage
    }
  }

  @action
  private handleLogin: CommandListener<"NLN"> = ({ identity, gender, status }) => {
    const character = this.getCharacter(identity)
    character.gender = gender
    character.status = status
  }

  @action
  private handleLogout: CommandListener<"FLN"> = ({ character: name }) => {
    const character = this.getCharacter(name)
    character.status = "offline"
    character.statusMessage = ""
  }

  @action
  private handleStatus: CommandListener<"STA"> = ({ character: name, status, statusmsg }) => {
    const character = this.getCharacter(name)
    character.status = status
    character.statusMessage = statusmsg
  }
}
