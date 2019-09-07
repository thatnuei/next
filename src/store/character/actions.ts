import { Action } from "overmind"
import { createCharacter } from "../../character/helpers"
import { Character } from "../../character/types"
import createFactoryUpdate from "../../common/helpers/createFactoryUpdate"
import { Dictionary } from "../../common/types"
import { createCommandHandler } from "../fchat/helpers"
import { ServerCommand } from "../fchat/types"

export const handleCharacterCommand: Action<ServerCommand> = (
  { state },
  command,
) => {
  const updateCharacter = createFactoryUpdate(
    state.chat.characters as Dictionary<Character>, // bug in overmind types
    createCharacter,
  )

  const handlers = createCommandHandler({
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
    },
  })

  handlers(command)
}
