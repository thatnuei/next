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
