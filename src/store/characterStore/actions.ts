import { Action, AsyncAction } from "overmind"
import { State } from ".."
import { createCharacter } from "../../character/helpers"
import { Character, CharacterStatus } from "../../character/types"
import createFactoryUpdate from "../../common/helpers/createFactoryUpdate"
import sleep from "../../common/helpers/sleep"
import { Dictionary } from "../../common/types"
import { errorCodes } from "../chat/constants"
import { createCommandHandler } from "../chat/helpers"
import { ServerCommand } from "../chat/types"

function createUpdateCharacter(state: State) {
  return createFactoryUpdate(
    state.characterStore.characters as Dictionary<Character>, // bug in overmind types
    createCharacter,
  )
}

export const handleCommand: Action<ServerCommand> = ({ state }, command) => {
  const updateCharacter = createUpdateCharacter(state)

  const handler = createCommandHandler({
    LIS(params) {
      for (const [name, gender, status, statusMessage] of params.characters) {
        state.characterStore.characters[name] = createCharacter(
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
        state.characterStore.updatingStatus = false
      }
    },

    ERR({ number }) {
      if (
        state.characterStore.updatingStatus &&
        number === errorCodes.statusUpdateCooldown
      ) {
        state.characterStore.updatingStatus = false

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
  state.characterStore.updatingStatus = true

  // make sure that we can still _try_ to update our status,
  // even if we don't get a successful result
  await sleep(3000)
  state.characterStore.updatingStatus = false
}

type UpdatedStatus = {
  status: CharacterStatus
  statusMessage: ""
}
