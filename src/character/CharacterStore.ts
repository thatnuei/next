import { observable } from "mobx"
import { CommandListener, socketStore } from "../network/SocketStore"
import { CharacterModel } from "./CharacterModel"

class CharacterStore {
  characters = observable.map<string, CharacterModel>()

  setupListeners() {
    socketStore.addCommandListener("LIS", this.handleInitialCharacterData)
  }

  private handleInitialCharacterData: CommandListener<"LIS"> = ({ characters }) => {
    const newCharacters: Record<string, CharacterModel> = {}
    for (const characterData of characters) {
      newCharacters[characterData[0]] = new CharacterModel(...characterData)
    }
    this.characters.merge(newCharacters)
  }
}

export const characterStore = new CharacterStore()
