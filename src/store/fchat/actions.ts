import { Action } from "overmind"

export const connectToChat: Action = ({ state, effects }) => {
  const { account, ticket } = state.user
  const { identity } = state.chat
  effects.socket.connect(account, ticket, identity)
  state.characterSelect.loading = true
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
