import { action, computed, observable } from "mobx"
import { channelStore } from "../channel/ChannelStore"
import { clamp } from "../helpers/math"
import { privateChatStore } from "../privateChat/PrivateChatStore"
import { ConversationModel } from "./ConversationModel"

export class ConversationStore {
  @observable.ref
  activeConversationIndex = 0

  constructor() {}

  @computed
  get channelConversations() {
    return channelStore.joinedChannels.sort((a, b) => a.title.localeCompare(b.title))
  }

  @computed
  get privateConversations() {
    return privateChatStore.openChats.sort((a, b) => a.partner.localeCompare(b.partner))
  }

  @computed
  get conversations(): ConversationModel[] {
    return [...this.channelConversations, ...this.privateConversations]
  }

  @computed
  get activeConversation(): ConversationModel | undefined {
    const index = clamp(this.activeConversationIndex, 0, this.conversations.length - 1)
    return this.conversations[index]
  }

  @action
  setActiveConversation(convo: ConversationModel) {
    const index = this.conversations.indexOf(convo)
    if (index > -1) {
      this.activeConversationIndex = index
    }
  }

  isActive(convo: ConversationModel) {
    const current = this.activeConversation
    return current !== undefined && current.id === convo.id
  }
}

export const conversationStore = new ConversationStore()
