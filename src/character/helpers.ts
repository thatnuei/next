import { createCommandHandler } from "../chat/commands"
import { ChatState } from "../chat/types"
import { CharacterGender, CharacterState, CharacterStatus } from "./types"

export function createCharacter(
  name: string,
  gender: CharacterGender = "None",
  status: CharacterStatus = "offline",
  statusMessage = "",
): CharacterState {
  return { name, gender, status, statusMessage }
}

export function createCharacterActions(state: ChatState) {
  return {
    getCharacter(name: string) {
      return state.characters[name] || createCharacter(name)
    },
  }
}

export function createCharacterCommandHandler(state: ChatState) {
  return createCommandHandler(undefined, {
    LIS({ characters }) {
      for (const [name, gender, status, statusMessage] of characters) {
        state.characters[name] = createCharacter(
          name,
          gender,
          status,
          statusMessage,
        )
      }
    },

    NLN({ identity: name, gender, status }) {
      state.characters[name] = createCharacter(name, gender, status)
    },

    FLN({ character: name }) {
      const char = state.characters[name]
      if (char) {
        char.status = "offline"
        char.statusMessage = ""
      }
    },

    STA({ character: name, status, statusmsg }) {
      const char = state.characters[name]
      if (char) {
        char.status = status
        char.statusMessage = statusmsg
      }
    },
  })
}
