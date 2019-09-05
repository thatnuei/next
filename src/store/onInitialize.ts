import { OnInitialize } from "overmind"

export const onInitialize: OnInitialize = async ({ actions, effects }) => {
  effects.socket.events.listen("close", () => {
    actions.handleSocketClose()
  })

  effects.socket.events.listen("error", () => {
    actions.handleSocketError()
  })

  effects.socket.events.listen("command", (command) => {
    if (command.type === "IDN") {
      actions.handleChatIdentifySuccess()
    }
  })
}
