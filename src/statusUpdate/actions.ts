import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"

export function useStatusUpdateActions() {
  const { state, socket, identity } = useChatContext()

  return {
    showStatusUpdateScreen() {
      const { status, statusMessage } = state.characters.get(identity)
      state.statusUpdateForm.status = status
      state.statusUpdateForm.statusMessage = statusMessage
      state.statusUpdateOverlay.show()
    },

    submitStatusUpdate() {
      const form = state.statusUpdateForm

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
      }, 5500)
    },
  }
}

export function createStatusCommandHandler(state: ChatState, identity: string) {
  return createCommandHandler(undefined, {
    STA({ character }) {
      if (character === identity) {
        state.statusUpdateOverlay.hide()
      }
    },
  })
}
