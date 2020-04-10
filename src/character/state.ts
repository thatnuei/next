import { observable } from "mobx"
import { useChatState } from "../chat/chatStateContext"
import { createCommandHandler } from "../chat/commandHelpers"
import { useCommandStream } from "../chat/commandStreamContext"
import { useChatSocket } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
import { useApiContext } from "../flist/api-context"
import { useStreamListener } from "../state/stream"
import { CharacterGender, CharacterStatus } from "./types"

export class CharacterModel {
  constructor(
    public readonly name: string,
    gender: CharacterGender = "None",
    status: CharacterStatus = "offline",
    statusMessage: string = "",
  ) {
    this.gender = gender
    this.status = status
    this.statusMessage = statusMessage
  }

  @observable
  gender: CharacterGender

  @observable
  status: CharacterStatus

  @observable
  statusMessage: string
}

export function useCharacterListeners() {
  const state = useChatState()
  const socket = useChatSocket()
  const api = useApiContext()

  useStreamListener(useChatStream(), (event) => {
    if (event.type === "update-ignored") {
      socket.send({
        type: "IGN",
        params: { action: event.action, character: event.name },
      })
    }

    if (event.type === "update-bookmark") {
      if (event.action === "add") {
        api.addBookmark({ name: event.name }).catch(console.error) // show error toast
      } else {
        api.removeBookmark({ name: event.name }).catch(console.error) // show error toast
      }
    }
  })

  useStreamListener(
    useCommandStream(),
    createCommandHandler({
      async IDN() {
        const { friendlist, bookmarklist } = await api.getFriendsAndBookmarks()
        state.bookmarks.replace(bookmarklist)
        state.friends.replace(friendlist.map((entry) => entry.dest))
      },

      IGN(params) {
        if (params.action === "init" || params.action === "list") {
          state.ignored.replace(params.characters)
        }
        if (params.action === "add") {
          state.ignored.add(params.character)
        }
        if (params.action === "delete") {
          state.ignored.delete(params.character)
        }
      },

      ADL({ ops }) {
        state.admins.replace(ops)
      },

      RTB(params) {
        if (params.type === "trackadd") {
          state.bookmarks.add(params.name)
          // show toast
        }

        if (params.type === "trackrem") {
          state.bookmarks.delete(params.name)
          // show toast
        }

        if (params.type === "friendadd") {
          state.friends.add(params.name)
          // show toast
        }

        if (params.type === "friendremove") {
          state.friends.delete(params.name)
          // show toast
        }
      },

      LIS({ characters }) {
        for (const [name, gender, status, statusMessage] of characters) {
          state.characters.update(name, (char) => {
            char.gender = gender
            char.status = status
            char.statusMessage = statusMessage
          })
        }
      },

      NLN({ identity: name, gender, status }) {
        state.characters.update(name, (char) => {
          char.gender = gender
          char.status = status
          char.statusMessage = ""
        })
      },

      FLN({ character: name }) {
        state.characters.update(name, (char) => {
          char.status = "offline"
          char.statusMessage = ""
        })
      },

      STA({ character: name, status, statusmsg }) {
        state.characters.update(name, (char) => {
          char.status = status
          char.statusMessage = statusmsg
        })
      },
    }),
  )
}
