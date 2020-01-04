import { computed, observable } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import { createMessage } from "../message/helpers"
import { FactoryMap } from "../state/classes/FactoryMap.new"
import { createPrivateChat } from "./helpers"

export class PrivateChatStore {
  private readonly chats = new FactoryMap(createPrivateChat)

  @observable
  private readonly currentPartnerNames = new Set<string>()

  @computed
  get currentChats() {
    return this.chats.values.filter((it) =>
      this.currentPartnerNames.has(it.partnerName),
    )
  }

  open = (partnerName: string) => {
    this.currentPartnerNames.add(partnerName)
  }

  close = (partnerName: string) => {
    this.currentPartnerNames.delete(partnerName)
  }

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
