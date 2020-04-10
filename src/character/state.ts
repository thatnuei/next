import { observable } from "mobx"
import { useChatState } from "../chat/chatStateContext"
import { createCommandHandler } from "../chat/commandHelpers"
import { useCommandStream } from "../chat/commandStreamContext"
import { useChatSocket } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
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
  const state = useChatState()
  const socket = useChatSocket()

  useStreamListener(useChatStream(), (event) => {
    if (event.type === "update-ignored") {
      socket.send({
        type: "IGN",
        params: { action: event.action, character: event.name },
      })
    }
  })

  useStreamListener(
    useCommandStream(),
    createCommandHandler({
      FRL({ characters }) {
        state.friends.replace(characters)
      },

      IGN(params) {
        if (params.action === "init" || params.action === "list") {
          state.ignored.replace(params.characters)
        }
        if (params.action === "add") {
          state.ignored.add(params.character)
        }
        if (params.action === "delete") {
          state.ignored.delete(params.character)
        }
      },

      ADL({ ops }) {
        state.admins.replace(ops)
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
