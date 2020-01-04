import { observable } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import { Character } from "./types"

export class CharacterStore {
  @observable
  private readonly characters = new Map<string, Character>()

  add = (char: Character) => {
    this.characters.set(char.name, char)
  }

  get = (name: string): Character =>
    this.characters.get(name) ?? {
      name,
      gender: "None",
      status: "offline",
      statusMessage: "",
    }

  update = (name: string, update: (char: Character) => void) => {
    const char = this.get(name)
    update(char)
    this.add(char)
  }

  handleSocketCommand = createCommandHandler({
    LIS: ({ characters }) => {
      for (const [name, gender, status, statusMessage] of characters) {
        this.add({ name, gender, status, statusMessage })
      }
    },

    NLN: ({ identity, gender, status }) => {
      this.add({
        name: identity,
        gender,
        status,
        statusMessage: "",
      })
    },

    FLN: ({ character: identity }) => {
      this.update(identity, (char) => {
        char.status = "offline"
        char.statusMessage = ""
      })
    },

    STA: ({ character: identity, status, statusmsg }) => {
      this.update(identity, (char) => {
        char.status = status
        char.statusMessage = statusmsg
      })
    },
  })
}
