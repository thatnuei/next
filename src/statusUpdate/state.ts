import { observable } from "mobx"
import { CharacterStatus } from "../character/types"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"
import { OverlayModel } from "../ui/OverlayModel"

export class StatusUpdateState {
  @observable status: CharacterStatus = "online"
  @observable statusMessage = ""

  @observable canSubmit = true
  timeout = 5000

  overlay = new OverlayModel()
}

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
  return createCommandHandler({
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
