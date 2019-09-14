import { Action, AsyncAction } from "overmind"
import { State } from ".."
import { createCharacter } from "../../character/helpers"
import { Character, CharacterStatus } from "../../character/types"
import createFactoryUpdate from "../../common/helpers/createFactoryUpdate"
import sleep from "../../common/helpers/sleep"
import { Dictionary } from "../../common/types"
import { ServerCommand } from "../chat/types"
import { errorCodes } from "./constants"
import { createCommandHandler } from "./helpers"

export const setIdentity: Action<string> = ({ state, effects }, identity) => {
  state.chat.identity = identity
  effects.chat.identityStorage.set(state.user.account, identity)
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
    actions.chat.handleChatCommand(command)
    actions.chat.handleCharacterCommand(command)
  })
}

export const handleSocketClose: Action = ({ state, actions }) => {
  state.chat.connecting = false
  actions.showLogin()
}

export const handleSocketError: Action = ({ state, actions }) => {
  state.chat.connecting = false
  actions.showLogin()
}

export const handleChatCommand: Action<ServerCommand> = (
  { state, actions },
  command,
) => {
  const handler = createCommandHandler({
    IDN() {
      state.chat.connecting = false
      actions.showChat()
    },
  })

  handler(command)
}

function createUpdateCharacter(state: State) {
  return createFactoryUpdate(
    state.chat.characters as Dictionary<Character>, // bug in overmind types
    createCharacter,
  )
}

export const handleCharacterCommand: Action<ServerCommand> = (
  { state, actions },
  command,
) => {
  const updateCharacter = createUpdateCharacter(state)

  const handler = createCommandHandler({
    LIS(params) {
      for (const [name, gender, status, statusMessage] of params.characters) {
        state.chat.characters[name] = createCharacter(
          name,
          gender,
          status,
          statusMessage,
        )
      }
    },

    NLN({ identity, gender, status }) {
      updateCharacter(identity, (char) => ({ ...char, gender, status }))
    },

    FLN({ character }) {
      updateCharacter(character, (char) => {
        char.status = "offline"
        char.statusMessage = ""
      })
    },

    STA({ character, status, statusmsg }) {
      updateCharacter(character, (char) => {
        char.status = status
        char.statusMessage = statusmsg
      })

      if (character === state.chat.identity) {
        state.chat.updatingStatus = false
      }
    },

    ERR({ number }) {
      if (
        state.chat.updatingStatus &&
        number === errorCodes.statusUpdateCooldown
      ) {
        state.chat.updatingStatus = false

        // actions.showUiMessage({
        //   text: "Please wait 1 second between status updates.",
        //   level: "error",
        // })
      }
    },
  })

  handler(command)
}

export const updateStatus: AsyncAction<UpdatedStatus> = async (
  { state, effects },
  { status, statusMessage },
) => {
  effects.chat.socket.sendCommand("STA", { status, statusmsg: statusMessage })
  state.chat.updatingStatus = true

  // make sure that we can still _try_ to update our status,
  // even if we don't get a successful result
  await sleep(3000)
  state.chat.updatingStatus = false
}

type UpdatedStatus = {
  status: CharacterStatus
  statusMessage: ""
}
