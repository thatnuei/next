import produce from "immer"
import type { Dict } from "../common/types"
import { createSimpleContext } from "../react/createSimpleContext"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { createStore } from "../state/store"
import type { Character } from "./types"

type CharacterStore = ReturnType<typeof createCharacterStore>

const createCharacter = (name: string): Character => ({
  name,
  gender: "None",
  status: "offline",
  statusMessage: "",
})

export function createCharacterStore() {
  const characters = createStore<Dict<Character>>({})

  const store = {
    characters,
    handleCommand(command: ServerCommand) {
      matchCommand(command, {
        LIS: (params) => {
          const newCharacters: { [name: string]: Character } = {}
          // prettier-ignore
          for (const [name, gender, status, statusMessage] of params.characters) {
            newCharacters[name] = { name, gender, status, statusMessage }
          }
          characters.merge(newCharacters)
        },

        NLN: ({ identity: name, gender, status }) => {
          characters.update(
            produce((characters) => {
              const char = (characters[name] ??= createCharacter(name))
              char.gender = gender
              char.status = status
              char.statusMessage = ""
            }),
          )
        },

        FLN: ({ character: name }) => {
          characters.update(
            produce((characters) => {
              delete characters[name]
            }),
          )
        },

        STA: ({ character: name, status, statusmsg }) => {
          characters.update(
            produce((characters) => {
              const char = (characters[name] ??= createCharacter(name))
              char.status = status
              char.statusMessage = statusmsg
            }),
          )
        },
      })
    },
  }

  return store
}

export const {
  Provider: CharacterStoreProvider,
  useValue: useCharacterStore,
  useOptionalValue: useOptionalCharacterStore,
} = createSimpleContext<CharacterStore>("CharacterStore")

export function useCharacter(name: string): Character {
  const store = useCharacterStore()
  return (
    store.characters.derived((state) => state[name]).useValue() ??
    createCharacter(name)
  )
}
