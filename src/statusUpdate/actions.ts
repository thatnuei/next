import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"

export function useStatusUpdateActions() {
  const { state, socket, identity } = useChatContext()

  return {
    showStatusUpdateScreen() {
      const { status, statusMessage } = state.characters.get(identity)
      state.statusUpdate.status = status
      state.statusUpdate.statusMessage = statusMessage
      state.statusUpdate.overlay.show()
    },

    submitStatusUpdate() {
      const form = state.statusUpdate

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
    },
  }
}

export function createStatusCommandHandler(state: ChatState, identity: string) {
  return createCommandHandler(undefined, {
    VAR({ variable, value }) {
      if (variable === "sta_flood") {
        state.statusUpdate.timeout = Number(value) || 5000
      }
    },
    STA({ character }) {
      if (character === identity) {
        state.statusUpdate.overlay.hide()
      }
    },
  })
}
