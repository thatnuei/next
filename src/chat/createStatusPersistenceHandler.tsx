import type { CharacterStatus } from "../character/types"
import { decodeHtml } from "../dom/decodeHtml"
import type { ChatSocket } from "../socket/ChatSocket"
import { createCommandHandler } from "../socket/helpers"
import { keyValueStore } from "../storage/keyValueStore"

export function clearStoredStatus(identity: string) {
  keyValueStore.delete(`status:${identity}`)
}

export default function createStatusPersistenceHandler(
  identity: string,
  socket: ChatSocket,
) {
  return createCommandHandler({
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
        socket.send({
          type: "STA",
          params: {
            status: savedStatus.status as CharacterStatus,
            statusmsg: savedStatus.statusmsg,
          },
        })
      }
    },
  })
}
