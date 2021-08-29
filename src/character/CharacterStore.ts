import type { Dict, Mutable } from "../common/types"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { DictStore } from "../state/store"
import type { Character, CharacterGender, CharacterStatus } from "./types"

export class CharacterStore extends DictStore<Character> {
  constructor() {
    super((name) => ({
      name,
      gender: "None",
      status: "offline",
      statusMessage: "",
    }))
  }

  setGender(name: string, gender: CharacterGender) {
    this.updateItem(name, (char) => ({ ...char, gender }))
  }

  setStatus(name: string, status: CharacterStatus, statusMessage: string) {
    this.updateItem(name, (char) => ({ ...char, status, statusMessage }))
  }

  handleCommand(command: ServerCommand) {
    matchCommand(command, {
      LIS: ({ characters }) => {
        const newCharacters: Mutable<Dict<Character>> = {}
        for (const [name, gender, status, statusMessage] of characters) {
          newCharacters[name] = { name, gender, status, statusMessage }
        }
        this.setItems(newCharacters)
      },

      NLN: ({ identity: name, gender, status }) => {
        this.setGender(name, gender)
        this.setStatus(name, status, "")
      },

      FLN: ({ character: name }) => {
        this.setStatus(name, "offline", "")
      },

      STA: ({ character: name, status, statusmsg }) => {
        this.setStatus(name, status, statusmsg)
      },
    })
  }
}
