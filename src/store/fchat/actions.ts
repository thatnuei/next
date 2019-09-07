import { Action } from "overmind"

export const connectToChat: Action = ({ state, effects }) => {
  const { account, ticket } = state.user
  const { identity } = state.chat
  effects.socket.connect(account, ticket, identity)
  state.characterSelect.loading = true
}

export const addSocketListeners: Action = ({ actions, effects }) => {
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

export const handleSocketClose: Action = ({ state, actions }) => {
  actions.showLogin()
  state.characterSelect.loading = false
}

export const handleSocketError: Action = ({ state, actions }) => {
  actions.showLogin()
  state.characterSelect.loading = false
}

export const handleChatIdentifySuccess: Action = ({ state, actions }) => {
  state.view = "chat"
  state.characterSelect.loading = false
}
