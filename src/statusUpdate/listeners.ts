import { useChatState } from "../chat/chatStateContext"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatStream } from "../chat/streamContext"
import { useSocket, useSocketListener } from "../socket/socketContext"
import { useStreamListener } from "../state/stream"

export function useStatusUpdateListeners() {
  const state = useChatState()
  const form = state.statusUpdate

  const socket = useSocket()
  const { identity } = useChatCredentials()
  const chatStream = useChatStream()

  useStreamListener(chatStream, (event) => {
    if (event.type === "show-status-update") {
      const { status, statusMessage } = state.characters.get(identity)
      form.status = status
      form.statusMessage = statusMessage
      form.overlay.show()
    }

    if (event.type === "submit-status-update") {
      if (!form.canSubmit) return
      form.canSubmit = false

      socket.send({
        type: "STA",
        params: {
          status: form.status,
          statusmsg: form.statusMessage,
        },
      })

      setTimeout(() => {
        form.canSubmit = true
      }, form.timeout)
    }
  })

  useSocketListener({
    VAR({ variable, value }) {
      if (variable === "sta_flood") {
        state.statusUpdate.timeout = (Number(value) || 5) * 1000 // value is in seconds
      }
    },

    STA({ character }) {
      if (character === identity) {
        state.statusUpdate.overlay.hide()
      }
    },
  })
}
