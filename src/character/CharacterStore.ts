import { createSimpleContext } from "../react/createSimpleContext"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { DictStore, useStoreSelect } from "../state/store"
import type { Character } from "./types"

export class CharacterStore extends DictStore<Character> {
  constructor() {
    super((name) => ({
      name,
      gender: "None",
      status: "offline",
      statusMessage: "",
    }))
  }

  handleCommand(command: ServerCommand) {
    matchCommand(command, {
      LIS: ({ characters }) => {
        const newCharacters: { [name: string]: Character } = {}
        for (const [name, gender, status, statusMessage] of characters) {
          newCharacters[name] = { name, gender, status, statusMessage }
        }
        this.merge(newCharacters)
      },

      NLN: ({ identity: name, gender, status }) => {
        this.updateItem(name, (char) => ({
          ...char,
          gender,
          status,
          statusMessage: "",
        }))
      },

      FLN: ({ character: name }) => {
        this.updateItem(name, (char) => ({
          ...char,
          status: "offline",
          statusMessage: "",
        }))
      },

      STA: ({ character: name, status, statusmsg }) => {
        this.updateItem(name, (char) => ({
          ...char,
          status,
          statusMessage: statusmsg,
        }))
      },
    })
  }
}

export const {
  Provider: CharacterStoreProvider,
  useValue: useCharacterStore,
  useOptionalValue: useOptionalCharacterStore,
} = createSimpleContext<CharacterStore>("CharacterStore")

export function useCharacter(name: string): Character {
  const store = useCharacterStore()
  return useStoreSelect(store, () => store.getItemWithFallback(name))
}
