import { concat, filter, without } from "lodash/fp"
import { useSetRecoilState } from "recoil"
import { useChatState } from "../chat/chatStateContext"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatStream } from "../chat/streamContext"
import { useApiContext } from "../flist/api-context"
import { useSocket, useSocketListener } from "../socket/socketContext"
import { useStreamListener } from "../state/stream"
import { adminsAtom, bookmarksAtom, friendsAtom, ignoredAtom } from "./state"

export function useCharacterListeners() {
  const state = useChatState()
  const socket = useSocket()
  const api = useApiContext()
  const { identity } = useChatCredentials()
  const setFriends = useSetRecoilState(friendsAtom)
  const setBookmarks = useSetRecoilState(bookmarksAtom)
  const setIgnored = useSetRecoilState(ignoredAtom)
  const setAdmins = useSetRecoilState(adminsAtom)

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

  useSocketListener({
    async IDN() {
      const { friendlist, bookmarklist } = await api.getFriendsAndBookmarks()
      setBookmarks(bookmarklist)
      setFriends(
        friendlist.map((entry) => ({ us: entry.source, them: entry.dest })),
      )
    },

    IGN(params) {
      if (params.action === "init" || params.action === "list") {
        setIgnored(params.characters)
      }
      if (params.action === "add") {
        setIgnored(concat(params.character))
      }
      if (params.action === "delete") {
        setIgnored(without([params.character]))
      }
    },

    ADL({ ops }) {
      setAdmins(ops)
    },

    RTB(params) {
      if (params.type === "trackadd") {
        setBookmarks(concat(params.name))
        // show toast
      }

      if (params.type === "trackrem") {
        setBookmarks(without([params.name]))
        // show toast
      }

      if (params.type === "friendadd") {
        setFriends(concat({ us: identity, them: params.name }))
        // show toast
      }

      if (params.type === "friendremove") {
        setFriends(filter((it) => it.them === params.name))
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
  })
}
