import { createCommandHandler } from "../chat/commands"
import { MapWithDefault } from "../state/MapWithDefault"
import { CharacterModel } from "./CharacterModel"

export class CharacterStore {
  characters = new MapWithDefault((name) => new CharacterModel(name))

  getCharacter = (name: string) => this.characters.get(name)

  handleCommand = createCommandHandler(this, {
    LIS({ characters }) {
      for (const [name, gender, status, statusMessage] of characters) {
        this.characters.set(
          name,
          new CharacterModel(name, gender, status, statusMessage),
        )
      }
    },

    NLN({ identity, gender, status }) {
      this.characters.set(
        identity,
        new CharacterModel(identity, gender, status),
      )
    },

    FLN({ character }) {
      this.characters.delete(character)
    },

    STA({ character: name, status, statusmsg }) {
      this.characters.update(name, (char) => {
        char.status = status
        char.statusMessage = statusmsg
      })
    },
  })
}
