import { Action, AsyncAction } from "overmind"
import { createCharacter } from "../../character/helpers"
import { CharacterStatus } from "../../character/types"
import createFactoryUpdate from "../../common/helpers/createFactoryUpdate"
import sleep from "../../common/helpers/sleep"
import { errorCodes } from "../fchat/constants"
import { createCommandHandler } from "../fchat/helpers"
import { ServerCommand } from "../fchat/types"
import { State } from "../state"

function createUpdateCharacter(state: State) {
  return createFactoryUpdate(state.chat.characters, createCharacter)
}

export const handleCharacterCommand: Action<ServerCommand> = (
  { state, actions },
  command,
) => {
  const updateCharacter = createUpdateCharacter(state as State) // bug in overmind types

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

        actions.showUiMessage({
          text: "Please wait 1 second between status updates.",
          level: "error",
        })
      }
    },
  })

  handler(command)
}

export const updateStatus: AsyncAction<UpdatedStatus> = async (
  { state, effects },
  { status, statusMessage },
) => {
  effects.socket.sendCommand("STA", { status, statusmsg: statusMessage })
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
