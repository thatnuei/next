import createCommandHandler from "../fchat/createCommandHandler"
import FactoryMap from "../state/FactoryMap"
import useInstanceValue from "../state/useInstanceValue"
import { Character, CharacterStatus, Gender } from "./types"

function createCharacter(
  name: string,
  gender: Gender = "None",
  status: CharacterStatus = "offline",
  statusMessage = "",
): Character {
  return { name, gender, status, statusMessage }
}

export default function useCharacterStore() {
  const characters = useInstanceValue(() => new FactoryMap(createCharacter))

  const handleCommand = createCommandHandler({
    LIS({ characters: characterInfoTuples }) {
      for (const [name, ...args] of characterInfoTuples) {
        characters.set(name, createCharacter(name, ...args))
      }
    },

    NLN({ gender, identity }) {
      characters.update(identity, (char) => {
        char.gender = gender
        char.status = "online"
      })
    },

    FLN({ character: identity }) {
      characters.update(identity, (char) => {
        char.status = "offline"
        char.statusMessage = ""
      })
    },

    STA({ character: identity, status, statusmsg }) {
      characters.update(identity, (char) => {
        char.status = status
        char.statusMessage = statusmsg
      })
    },
  })

  return { characters, handleCommand }
}

export type CharacterStore = ReturnType<typeof useCharacterStore>
