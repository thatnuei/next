import { useImmer } from "use-immer"
import { Dictionary, Mutable } from "../common/types"
import createCommandHandler from "../fchat/createCommandHandler"
import CharacterModel from "./CharacterModel"

export default function useCharacterStore() {
  const [characters, updateCharacters] = useImmer<Dictionary<CharacterModel>>({})

  function getCharacter(name: string) {
    return characters[name] || new CharacterModel(name, "None", "offline")
  }

  function updateCharacter(
    name: string,
    update: (char: Mutable<CharacterModel>) => CharacterModel | void,
  ) {
    updateCharacters((characters) => {
      const char = getCharacter(name)
      characters[name] = update(char) || char
    })
  }

  const handleCommand = createCommandHandler({
    LIS({ characters }) {
      updateCharacters((draft) => {
        for (const args of characters) {
          draft[args[0]] = new CharacterModel(...args)
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
