import { action, observable } from "mobx"
import { AppStore } from "../app/AppStore"
import { CommandListener } from "../socket/SocketStore"
import { CharacterModel } from "./CharacterModel"

export class CharacterStore {
  characters = observable.map<string, CharacterModel>()

  constructor(appStore: AppStore) {
    appStore.socketEvents.listen("LIS", this.handleInitialCharacterData)
    appStore.socketEvents.listen("NLN", this.handleLogin)
    appStore.socketEvents.listen("FLN", this.handleLogout)
    appStore.socketEvents.listen("STA", this.handleStatus)
  }

  getCharacter(name: string) {
    return this.characters.get(name) || new CharacterModel(name, "None", "offline")
  }

  @action
  private handleInitialCharacterData: CommandListener<"LIS"> = ({ characters }) => {
    const map: Record<string, CharacterModel> = {}
    for (const [name, gender, status, statusMessage] of characters) {
      map[name] = new CharacterModel(name, gender, status, statusMessage)
    }
    this.characters.merge(map)
  }

  @action
  private handleLogin: CommandListener<"NLN"> = ({ identity, gender }) => {
    this.characters.set(identity, new CharacterModel(identity, gender, "online"))
  }

  @action
  private handleLogout: CommandListener<"FLN"> = ({ character: character }) => {
    const { gender } = this.getCharacter(character)
    this.characters.set(character, new CharacterModel(character, gender, "offline"))
  }

  @action
  private handleStatus: CommandListener<"STA"> = ({ character, status, statusmsg }) => {
    const { gender } = this.getCharacter(character)
    this.characters.set(character, new CharacterModel(character, gender, status, statusmsg))
  }
}
