import { createCommandHandler } from "../chat/helpers"
import { createMessage } from "../message/helpers"
import { FactoryMap } from "../state/classes/FactoryMap.new"
import { createPrivateChat } from "./helpers"

export class PrivateChatStore {
  readonly chats = new FactoryMap(createPrivateChat)

  handleSocketCommand = createCommandHandler({
    PRI: ({ character, message }) => {
      this.chats.update(character, (chat) => {
        chat.messages.push(createMessage(character, message, "chat"))
      })
    },

    RLL: (params) => {
      if ("recipient" in params) {
        const { character, message } = params
        this.chats.update(character, (chat) => {
          chat.messages.push(createMessage(character, message, "chat"))
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
