import { isTruthy } from "../common/isTruthy"
import { truthyMap } from "../common/truthyMap"
import type { FListApi } from "../flist/api"
import { createSimpleContext } from "../react/createSimpleContext"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { createDictStore } from "../state/dict-store"
import { createStore, useStoreValue } from "../state/store"
import type { Character, Friendship } from "./types"

type CharacterStore = ReturnType<typeof createCharacterStore>

const createCharacter = (name: string): Character => ({
  name,
  gender: "None",
  status: "offline",
  statusMessage: "",
})

export function createCharacterStore(api: FListApi, identity: string) {
  const characters = createDictStore(createCharacter)
  const friendships = createStore<readonly Friendship[]>([])
  const bookmarks = createDictStore<true>(() => true)
  const ignores = createDictStore<true>(() => true)
  const admins = createDictStore<true>(() => true)

  async function fetchLikes() {
    try {
      const result = await api.getFriendsAndBookmarks()

      const friends = result.friendlist.map((entry) => ({
        us: entry.source,
        them: entry.dest,
      }))

      friendships.set(friends)
      bookmarks.set(truthyMap(result.bookmarklist))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Failed to fetch friends and bookmarks", error)
    }
  }

  const store = {
    characters,
    friendships,
    bookmarks,
    ignores,
    admins,

    handleCommand(command: ServerCommand) {
      matchCommand(command, {
        IDN() {
          fetchLikes()
        },

        IGN(params) {
          if (params.action === "init" || params.action === "list") {
            ignores.set(truthyMap(params.characters))
          }
          if (params.action === "add") {
            ignores.setItem(params.character, true)
          }
          if (params.action === "delete") {
            ignores.deleteItem(params.character)
          }
        },

        ADL({ ops }) {
          admins.set(truthyMap(ops))
        },

        AOP({ character }) {
          admins.setItem(character, true)
        },

        DOP({ character }) {
          admins.deleteItem(character)
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
          characters.updateItem(name, (char) => ({
            ...char,
            name,
            gender,
            status,
          }))
        },

        FLN: ({ character: name }) => {
          characters.deleteItem(name)
        },

        STA: ({ character: name, status, statusmsg }) => {
          characters.updateItem(name, (char) => ({
            ...char,
            status,
            statusMessage: statusmsg,
          }))
        },

        RTB(params) {
          switch (params.type) {
            case "trackadd":
            case "trackrem":
            case "friendadd":
            case "friendremove": {
              fetchLikes()
              break
            }
          }
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
