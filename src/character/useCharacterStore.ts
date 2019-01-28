import { useImmer } from "use-immer"
import { Dictionary, Mutable } from "../common/types"
import createCommandHandler from "../fchat/createCommandHandler"
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
  const [characters, updateCharacters] = useImmer<Dictionary<Character>>({})

  function getCharacter(name: string) {
    return characters[name] || createCharacter(name, "None", "offline")
  }

  function updateCharacter(name: string, update: (char: Mutable<Character>) => Character | void) {
    updateCharacters((characters) => {
      const char = characters[name] || createCharacter(name, "None", "offline")
      characters[name] = update(char) || char
    })
  }

  const handleCommand = createCommandHandler({
    LIS({ characters }) {
      updateCharacters((draft) => {
        for (const args of characters) {
          draft[args[0]] = createCharacter(...args)
        }
      })
    },

    NLN({ gender, identity }) {
      updateCharacter(identity, (char) => {
        char.gender = gender
        char.status = "online"
      })
    },

    FLN({ character: identity }) {
      updateCharacter(identity, (char) => {
        char.status = "offline"
        char.statusMessage = ""
      })
    },

    STA({ character: identity, status, statusmsg }) {
      updateCharacter(identity, (char) => {
        char.status = status
        char.statusMessage = statusmsg
      })
    },
  })

  return { characters, updateCharacters, updateCharacter, getCharacter, handleCommand }
}

export type CharacterStore = ReturnType<typeof useCharacterStore>
