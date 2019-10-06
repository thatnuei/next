import { Action } from "overmind"
import { ServerCommand } from "../chat/types"
import { createCommandHandler } from "./helpers"

export const setIdentity: Action<string> = ({ state, effects }, identity) => {
  state.chat.identity = identity
  effects.chat.identityStorage.set(state.user.account, identity)
}

export const showChannel: Action<string> = ({ state }, id) => {
  state.chat.currentRoom = { type: "channel", id }
}

export const connectToChat: Action = ({ state, effects }) => {
  const { account, ticket } = state.user
  const { identity } = state.chat
  effects.chat.socket.connect(account, ticket, identity)
  state.chat.connecting = true
}

export const addSocketListeners: Action = ({ actions, effects }) => {
  effects.chat.socket.events.listen("close", () => {
    actions.chat.handleSocketClose()
  })

  effects.chat.socket.events.listen("error", () => {
    actions.chat.handleSocketError()
  })

  effects.chat.socket.events.listen("command", (command) => {
    const handlers = [
      actions.chat.handleCommand,
      actions.character.handleCommand,
      actions.channel.handleCommand,
    ]
    handlers.forEach((handle) => handle(command))
  })
}

export const handleSocketClose: Action = ({ state, actions }) => {
  state.chat.connecting = false
  actions.app.showLogin()
}

export const handleSocketError: Action = ({ state, actions }) => {
  state.chat.connecting = false
  actions.app.showLogin()
}

export const handleCommand: Action<ServerCommand> = (
  { state, actions },
  command,
) => {
  const handler = createCommandHandler({
    IDN() {
      state.chat.connecting = false
      actions.app.showChat()

      actions.channel.joinChannel("Frontpage")
      actions.channel.joinChannel("Fantasy")
      actions.channel.joinChannel("Development")
      actions.channel.joinChannel("Story Driven LFRP")
    },

    JCH({ character, channel: id }) {
      if (
        character.identity === state.chat.identity &&
        !state.chat.currentRoom
      ) {
        actions.chat.showChannel(id)
      }
    },
  })

  handler(command)
}
