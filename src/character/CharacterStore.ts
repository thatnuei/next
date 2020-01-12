import { createCommandHandler } from "../chat/helpers"
import { FactoryMap } from "../state/classes/FactoryMap"
import { createCharacter } from "./helpers"

export class CharacterStore {
  private readonly characters = new FactoryMap(createCharacter)

  get = (name: string) => this.characters.get(name)

  handleSocketCommand = createCommandHandler({
    LIS: ({ characters }) => {
      for (const [name, ...args] of characters) {
        this.characters.set(name, createCharacter(name, ...args))
      }
    },

    NLN: ({ identity, gender, status }) => {
      this.characters.set(identity, createCharacter(identity, gender, status))
    },

    FLN: ({ character: identity }) => {
      this.characters.update(identity, (char) => {
        char.status = "offline"
        char.statusMessage = ""
      })
    },

    STA: ({ character: identity, status, statusmsg }) => {
      this.characters.update(identity, (char) => {
        char.status = status
        char.statusMessage = statusmsg
      })
    },
  })
}
