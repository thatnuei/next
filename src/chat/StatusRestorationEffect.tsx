import type { CharacterStatus } from "../character/types"
import { decodeHtml } from "../dom/decodeHtml"
import {
  useSocketActions,
  useSocketCommandMatch,
} from "../socket/SocketConnection"
import { keyValueStore } from "../storage/keyValueStore"
import { useIdentity } from "../user"

export function clearStoredStatus(identity: string) {
  keyValueStore.delete(`status:${identity}`)
}

export default function StatusRestorationEffect() {
  const identity = useIdentity()
  const socketActions = useSocketActions()

  useSocketCommandMatch({
    STA({ character, status, statusmsg }) {
      if (character === identity) {
        keyValueStore.set(`status:${identity}`, {
          status,
          statusmsg: decodeHtml(statusmsg),
        })
      }
    },

    async IDN({ character: identity }) {
      const savedStatus = (await keyValueStore.get(`status:${identity}`)) as
        | Record<string, unknown>
        | undefined

      if (
        typeof savedStatus?.status === "string" &&
        typeof savedStatus?.statusmsg === "string"
      ) {
        socketActions.send({
          type: "STA",
          params: {
            status: savedStatus.status as CharacterStatus,
            statusmsg: savedStatus.statusmsg,
          },
        })
      }
    },
  })

  return null
}
