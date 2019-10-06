import { action } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import FactoryMap from "../state/classes/FactoryMap"
import CharacterModel from "./CharacterModel"

export default class CharacterStore {
  characters = new FactoryMap((name) => new CharacterModel(name))

  @action
  handleSocketCommand = createCommandHandler({
    LIS: ({ characters: characterInfoTuples }) => {
      for (const [name, gender, status, statusMessage] of characterInfoTuples) {
        const char = this.characters.get(name)
        char.setGender(gender)
        char.setStatus(status, statusMessage)
      }
    },

    NLN: ({ gender, identity }) => {
      const char = this.characters.get(identity)
      char.setGender(gender)
      char.setStatus("online")
    },

    FLN: ({ character: identity }) => {
      const char = this.characters.get(identity)
      char.setStatus("offline")
    },

    STA: ({ character: identity, status, statusmsg }) => {
      const char = this.characters.get(identity)
      char.setStatus(status, statusmsg)
    },
  })
}
