import { concat, filter, without } from "lodash/fp"
import { useCallback } from "react"
import { useSetRecoilState } from "recoil"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatStream } from "../chat/streamContext"
import { useRootStore } from "../root/context"
import { runCommand, ServerCommand } from "../socket/commandHelpers"
import { useSocket, useSocketListener } from "../socket/socketContext"
import { useStreamListener } from "../state/stream"
import { adminsAtom, bookmarksAtom, friendsAtom, ignoredAtom } from "./state"

export function useCharacterListeners() {
  const socket = useSocket()
  const root = useRootStore()
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
        root.userStore.addBookmark({ name: event.name }).catch(console.error) // show error toast
      } else {
        root.userStore.removeBookmark({ name: event.name }).catch(console.error) // show error toast
      }
    }
  })

  useSocketListener(
    useCallback(
      (command: ServerCommand) => {
        return runCommand(command, {
          async IDN() {
            const {
              friendlist,
              bookmarklist,
            } = await root.userStore.getFriendsAndBookmarks()

            setBookmarks(bookmarklist)
            setFriends(
              friendlist.map((entry) => ({
                us: entry.source,
                them: entry.dest,
              })),
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
        })
      },
      [
        identity,
        root.userStore,
        setAdmins,
        setBookmarks,
        setFriends,
        setIgnored,
      ],
    ),
  )
}
