import { observable } from "mobx"
import { useChatState } from "../chat/chatStateContext"
import { createCommandHandler } from "../chat/commandHelpers"
import { useCommandStream } from "../chat/commandStreamContext"
import { useStreamListener } from "../state/stream"
import { CharacterGender, CharacterStatus } from "./types"

export class CharacterModel {
  constructor(
    public readonly name: string,
    gender: CharacterGender = "None",
    status: CharacterStatus = "offline",
    statusMessage: string = "",
  ) {
    this.gender = gender
    this.status = status
    this.statusMessage = statusMessage
  }

  @observable
  gender: CharacterGender

  @observable
  status: CharacterStatus

  @observable
  statusMessage: string
}

export function useCharacterListeners() {
  const commandStream = useCommandStream()
  const state = useChatState()

  useStreamListener(
    commandStream,
    createCommandHandler({
      FRL({ characters }) {
        state.friends = new Set(characters)
      },

      IGN(params) {
        if (params.action === "init" || params.action === "list") {
          state.ignored = new Set(params.characters)
        }
        if (params.action === "add") {
          state.ignored.add(params.character)
        }
        if (params.action === "delete") {
          state.ignored.delete(params.character)
        }
      },

      ADL({ ops }) {
        state.admins = new Set(ops)
      },

      LIS({ characters }) {
        for (const [name, gender, status, statusMessage] of characters) {
          state.characters.update(name, (char) => {
            char.gender = gender
            char.status = status
            char.statusMessage = statusMessage
          })
        }
      },

      NLN({ identity: name, gender, status }) {
        state.characters.update(name, (char) => {
          char.gender = gender
          char.status = status
          char.statusMessage = ""
        })
      },

      FLN({ character: name }) {
        state.characters.update(name, (char) => {
          char.status = "offline"
          char.statusMessage = ""
        })
      },

      STA({ character: name, status, statusmsg }) {
        state.characters.update(name, (char) => {
          char.status = status
          char.statusMessage = statusmsg
        })
      },
    }),
  )
}
