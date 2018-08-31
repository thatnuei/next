import { observable } from "mobx"
import { CommandListener, SocketConnectionHandler } from "../fchat/SocketConnectionHandler"
import { CharacterModel } from "./CharacterModel"

export class CharacterStore {
  characters = observable.map<string, CharacterModel>()

  constructor(connection: SocketConnectionHandler) {
    connection.addCommandListener("LIS", this.handleInitialCharacterData)
  }

  private handleInitialCharacterData: CommandListener<"LIS"> = ({ characters }) => {
    const newCharacters: Record<string, CharacterModel> = {}
    for (const characterData of characters) {
      newCharacters[characterData[0]] = new CharacterModel(...characterData)
    }
    this.characters.merge(newCharacters)
  }
}
