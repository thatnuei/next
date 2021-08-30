import produce from "immer"
import { omit } from "lodash-es"
import { isTruthy } from "../common/isTruthy"
import { truthyMap } from "../common/truthyMap"
import type { Dict, TruthyMap } from "../common/types"
import type { FListApi } from "../flist/api"
import { createSimpleContext } from "../react/createSimpleContext"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { createStore, useStoreValue } from "../state/store"
import type { Character, Friendship } from "./types"

type CharacterStore = ReturnType<typeof createCharacterStore>

const createCharacter = (name: string): Character => ({
  name,
  gender: "None",
  status: "offline",
  statusMessage: "",
})

export function createCharacterStore(api: FListApi) {
  const characters = createStore<Dict<Character>>({})
  const friendships = createStore<readonly Friendship[]>([])
  const bookmarks = createStore<TruthyMap>({})
  const ignores = createStore<TruthyMap>({})
  const admins = createStore<TruthyMap>({})

  const store = {
    characters,
    friendships,
    bookmarks,
    ignores,
    admins,

    handleCommand(command: ServerCommand) {
      matchCommand(command, {
        async IDN() {
          const result = await api.getFriendsAndBookmarks()

          const friends = result.friendlist.map((entry) => ({
            us: entry.source,
            them: entry.dest,
          }))

          friendships.set(friends)
          bookmarks.set(truthyMap(result.bookmarklist))
        },

        IGN(params) {
          if (params.action === "init" || params.action === "list") {
            ignores.set(truthyMap(params.characters))
          }
          if (params.action === "add") {
            ignores.update((prev) => ({
              ...prev,
              [params.character]: true,
            }))
          }
          if (params.action === "delete") {
            ignores.update((prev) => omit(prev, [params.character]))
          }
        },

        ADL({ ops }) {
          admins.set(truthyMap(ops))
        },

        AOP({ character }) {
          admins.update((admins) => ({ ...admins, [character]: true }))
        },

        DOP({ character }) {
          admins.update((admins) => omit(admins, [character]))
        },

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
    useStoreValue(store.characters.select((state) => state[name])) ??
    createCharacter(name)
  )
}

export function useCharacters(names: string[]) {
  const store = useCharacterStore()

  return useStoreValue(
    store.characters.select((characters) =>
      names.map((name) => characters[name]).filter(isTruthy),
    ),
  )
}
