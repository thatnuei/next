import { Action } from "overmind"
import { createCommandHandler } from "../fchat/helpers"
import { ServerCommand } from "../fchat/types"

export const setIdentity: Action<string> = ({ state, effects }, identity) => {
  state.chat.identity = identity
  effects.identityStorage.set(state.user.account, identity)
}

export const handleChatCommand: Action<ServerCommand> = (
  { state },
  command,
) => {
  const handler = createCommandHandler({
    IDN() {
      state.view = "chat"
      state.characterSelect.loading = false
    },
  })

  handler(command)
}
