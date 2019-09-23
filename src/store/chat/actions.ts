import { Action } from "overmind"
import { ServerCommand } from "../chat/types"
import { createCommandHandler } from "./helpers"

export const setIdentity: Action<string> = ({ state, effects }, identity) => {
  state.identity = identity
  effects.identityStorage.set(state.user.account, identity)
}

export const connectToChat: Action = ({ state, effects }) => {
  const { account, ticket } = state.user
  const { identity } = state
  effects.socket.connect(account, ticket, identity)
  state.connecting = true
}

export const addSocketListeners: Action = ({ actions, effects }) => {
  effects.socket.events.listen("close", () => {
    actions.chat.handleSocketClose()
  })

  effects.socket.events.listen("error", () => {
    actions.chat.handleSocketError()
  })

  effects.socket.events.listen("command", (command) => {
    const handlers = [
      actions.chat.handleCommand,
      actions.character.handleCommand,
      actions.channel.handleCommand,
    ]
    handlers.forEach((handle) => handle(command))
  })
}

export const handleSocketClose: Action = ({ state, actions }) => {
  state.connecting = false
  actions.app.showLogin()
}

export const handleSocketError: Action = ({ state, actions }) => {
  state.connecting = false
  actions.app.showLogin()
}

export const handleCommand: Action<ServerCommand> = (
  { state, actions },
  command,
) => {
  const handler = createCommandHandler({
    IDN() {
      state.connecting = false
      actions.app.showChat()
    },
  })

  handler(command)
}
