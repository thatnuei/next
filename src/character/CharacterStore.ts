import { action, observable } from "mobx"
import { CommandListener, socketStore } from "../socket/SocketStore"
import { CharacterModel } from "./CharacterModel"

export class CharacterStore {
  characters = observable.map<string, CharacterModel>()

  constructor() {
    socketStore.addCommandListener("LIS", this.handleInitialCharacterData)
    socketStore.addCommandListener("NLN", this.handleLogin)
    socketStore.addCommandListener("FLN", this.handleLogout)
    socketStore.addCommandListener("STA", this.handleStatus)
  }

  @action
  getCharacter(name: string) {
    const char = this.characters.get(name)
    if (char) return char

    const newChar = new CharacterModel(name, "None", "offline")
    this.characters.set(name, newChar)
    return newChar
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

export const characterStore = new CharacterStore()
