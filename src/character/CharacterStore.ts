import { action, observable } from "mobx"
import { RootStore } from "../app/RootStore"
import { CommandListener } from "../socket/SocketStore"
import { CharacterModel } from "./CharacterModel"

export class CharacterStore {
  characters = observable.map<string, CharacterModel>()

  constructor(rootStore: RootStore) {
    rootStore.socketStore.addCommandListener("LIS", this.handleInitialCharacterData)
    rootStore.socketStore.addCommandListener("NLN", this.handleLogin)
    rootStore.socketStore.addCommandListener("FLN", this.handleLogout)
    rootStore.socketStore.addCommandListener("STA", this.handleStatus)
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
