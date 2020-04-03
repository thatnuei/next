import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"

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
