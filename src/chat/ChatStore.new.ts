import { observable } from "mobx"
import { Character } from "../character/types"
import { createCommandHandler } from "./helpers"

export class ChatStore {
  @observable characters = new Map<string, Character>()

  constructor(private readonly identity: string) {}

  getCharacter = (name: string) =>
    this.characters.get(name) ?? {
      name,
      gender: "None",
      status: "offline",
      statusMessage: "",
    }

  get identityCharacter() {
    return this.getCharacter(this.identity)
  }

  handleSocketCommand = createCommandHandler({
    IDN() {
      // join last rooms and such
    },

    LIS: ({ characters }) => {
      for (const [name, gender, status, statusMessage] of characters) {
        this.characters.set(name, { name, gender, status, statusMessage })
      }
    },

    NLN: ({ identity, gender, status }) => {
      this.characters.set(identity, {
        name: identity,
        gender,
        status,
        statusMessage: "",
      })
    },

    FLN: ({ character: identity }) => {
      const char = this.characters.get(identity)
      if (char) {
        char.status = "offline"
        char.statusMessage = ""
      }
    },

    STA: ({ character: identity, status, statusmsg }) => {
      const char = this.characters.get(identity)
      if (char) {
        char.status = status
        char.statusMessage = statusmsg
      }
    },
  })
}
