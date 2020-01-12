import { createCommandHandler } from "../chat/helpers"
import { FactoryMap } from "../state/classes/FactoryMap"
import { PrivateChatModel } from "./PrivateChatModel"

export class PrivateChatStore {
  private readonly chats = new FactoryMap((name) => new PrivateChatModel(name))

  get = (partnerName: string) => this.chats.get(partnerName)

  handleSocketCommand = createCommandHandler({
    PRI: ({ character, message }) => {
      this.chats.update(character, (chat) => {
        chat.room.addMessage(character, message, "chat")
      })
    },

    RLL: (params) => {
      if ("recipient" in params) {
        const { character, message } = params
        this.chats.update(character, (chat) => {
          chat.room.addMessage(character, message, "chat")
        })
      }
    },

    TPN: ({ character, status }) => {
      this.chats.update(character, (chat) => {
        chat.partnerTypingStatus = status
      })
    },
  })
}
