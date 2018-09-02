import { action, computed, observable } from "mobx"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelStore } from "../channel/ChannelStore"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"

export type ChannelConversationType = { type: "channel"; id: string; model: ChannelModel }

export type PrivateConversationType = { type: "privateChat"; id: string; model: PrivateChatModel }

export type ConversationType = ChannelConversationType | PrivateConversationType

export class ConversationStore {
  @observable.ref
  activeConversation?: ConversationType

  constructor(private channelStore: ChannelStore, private privateChatStore: PrivateChatStore) {}

  @computed
  get channelConversations() {
    return [...this.channelStore.channels.values()]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(
        (channel): ChannelConversationType => ({
          type: "channel",
          id: `channel-${channel.id}`,
          model: channel,
        }),
      )
  }

  @computed
  get privateConversations() {
    return [...this.privateChatStore.privateChats.values()]
      .sort((a, b) => a.partner.localeCompare(b.partner))
      .map(
        (chat): PrivateConversationType => ({
          type: "privateChat",
          id: `privateChat-${chat.partner}`,
          model: chat,
        }),
      )
  }

  @action
  setActiveConversation(convo: ConversationType) {
    this.activeConversation = convo
  }

  isActive(convo: ConversationType) {
    const current = this.activeConversation
    return current && current.id === convo.id
  }
}
