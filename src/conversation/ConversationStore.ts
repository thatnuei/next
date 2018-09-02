import { action, computed, observable } from "mobx"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelStore } from "../channel/ChannelStore"
import { clamp } from "../helpers/math"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"

export type ChannelConversationType = { type: "channel"; id: string; model: ChannelModel }

export type PrivateConversationType = { type: "privateChat"; id: string; model: PrivateChatModel }

export type ConversationType = ChannelConversationType | PrivateConversationType

export class ConversationStore {
  @observable.ref
  activeConversationIndex = 0

  constructor(private channelStore: ChannelStore, private privateChatStore: PrivateChatStore) {}

  @computed
  get channelConversations() {
    return this.channelStore.joinedChannels.sort((a, b) => a.title.localeCompare(b.title)).map(
      (channel): ChannelConversationType => ({
        type: "channel",
        id: `channel-${channel.id}`,
        model: channel,
      }),
    )
  }

  @computed
  get privateConversations() {
    return this.privateChatStore.openChats.sort((a, b) => a.partner.localeCompare(b.partner)).map(
      (chat): PrivateConversationType => ({
        type: "privateChat",
        id: `privateChat-${chat.partner}`,
        model: chat,
      }),
    )
  }

  @computed
  get conversations(): ConversationType[] {
    return [...this.channelConversations, ...this.privateConversations]
  }

  @computed
  get activeConversation(): ConversationType | undefined {
    const index = clamp(this.activeConversationIndex, 0, this.conversations.length - 1)
    return this.conversations[index]
  }

  @action
  setActiveConversation(convo: ConversationType) {
    const index = this.conversations.indexOf(convo)
    if (index > -1) {
      this.activeConversationIndex = index
    }
  }

  isActive(convo: ConversationType) {
    const current = this.activeConversation
    return current && current.id === convo.id
  }
}
