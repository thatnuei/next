import { action, computed, observable } from "mobx"
import { ChatState } from "../chat/ChatState"
import { useChatState } from "../chat/chatStateContext"
import { createCommandHandler } from "../chat/commandHelpers"
import { useCommandStream } from "../chat/commandStreamContext"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatSocket } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
import { useChatNav } from "../chatNav/state"
import { MessageListModel } from "../message/MessageListModel"
import { MessageType } from "../message/MessageModel"
import { useStreamListener } from "../state/stream"
import { getStoredChannels } from "./storage"

export type ChannelMode = "both" | "chat" | "ads"
type ChannelJoinState = "absent" | "joining" | "present" | "leaving"

export class ChannelModel {
  constructor(public readonly id: string) {}

  @observable title = this.id
  @observable description = ""
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "both"
  @observable joinState: ChannelJoinState = "absent"
  @observable isUnread = false

  @observable.shallow users = new Set<string>()
  @observable.shallow ops = new Set<string>()

  messageList = new MessageListModel()

  @action
  setSelectedMode = (mode: ChannelMode) => {
    this.selectedMode = mode
  }

  /**
   * The "final" channel mode, based on the channel base mode and the selected mode.
   * If the channel's base mode is "both", we'll use the selected mode as the actual mode,
   * but if the channel has a more specific base mode, always respect the base mode
   */
  @computed
  get actualMode() {
    return this.mode === "both" ? this.selectedMode : this.mode
  }

  shouldShowMessage = (messageType: MessageType) => {
    if (this.actualMode === "ads") return messageType !== "normal"
    if (this.actualMode === "chat") return messageType !== "lfrp"
    return true
  }
}

function saveChannels(state: ChatState, account: string, identity: string) {
  const joinedChannels = [...state.channels.values()].filter(
    (it) => it.joinState !== "absent",
  )

  const storage = getStoredChannels(account)

  storage.update(
    (data) => {
      data.channelsByIdentity[identity] = joinedChannels.map((it) => ({
        id: it.id,
        title: it.title,
      }))
      return data
    },
    () => ({ channelsByIdentity: {} }),
  )
}

async function loadChannels(account: string, identity: string) {
  const storage = getStoredChannels(account)

  const data = await storage.get().catch((error) => {
    console.warn(`could not restore channels:`, error)
    return undefined
  })

  return data?.channelsByIdentity[identity] || []
}

export function useChannelListeners() {
  const state = useChatState()
  const { channels } = state

  const chatStream = useChatStream()
  const commandStream = useCommandStream()
  const socket = useChatSocket()
  const { account, identity } = useChatCredentials()
  const nav = useChatNav()

  useStreamListener(chatStream, (event) => {
    if (event.type === "join-channel") {
      channels.update(event.id, (channel) => {
        channel.joinState = "joining"
        if (event.title) channel.title = event.title
      })
      socket.send({ type: "JCH", params: { channel: event.id } })
    }

    if (event.type === "leave-channel") {
      channels.update(event.id, (channel) => {
        channel.joinState = "leaving"
      })
      socket.send({ type: "LCH", params: { channel: event.id } })
    }
  })

  useStreamListener(
    commandStream,
    createCommandHandler({
      async IDN() {
        const channels = await loadChannels(account, identity)
        if (channels.length === 0) {
          chatStream.send({ type: "open-channel-browser" })
        } else {
          for (const { id, title } of channels) {
            chatStream.send({ type: "join-channel", id, title })
          }
        }
      },

      JCH({ channel: id, character: { identity: name }, title }) {
        channels.update(id, (channel) => {
          channel.title = title
          channel.users.add(name)

          if (name === identity) {
            channel.joinState = "present"
            saveChannels(state, account, identity)
          }
        })
      },

      LCH({ channel: id, character }) {
        channels.update(id, (channel) => {
          channel.users.delete(character)

          if (character === identity) {
            channel.joinState = "absent"
            saveChannels(state, account, identity)
          }
        })
      },

      FLN({ character }) {
        for (const channel of channels.values()) {
          channel.users.delete(character)
        }
      },

      ICH({ channel: id, users, mode }) {
        channels.update(id, (channel) => {
          channel.users = new Set(users.map((it) => it.identity))
          channel.mode = mode
        })
      },

      CDS({ channel: id, description }) {
        channels.update(id, (channel) => {
          channel.description = description
        })
      },

      COL({ channel: id, oplist }) {
        channels.update(id, (channel) => {
          channel.ops = new Set(oplist)
        })
      },

      MSG({ channel: id, character, message }) {
        channels.update(id, (channel) => {
          channel.messageList.add(character, message, "normal", Date.now())

          if (nav.currentChannel !== channel) {
            channel.isUnread = true
          }
        })
      },

      LRP({ channel: id, character, message }) {
        channels.update(id, (channel) => {
          channel.messageList.add(character, message, "lfrp", Date.now())
        })
      },

      RLL(params) {
        if ("channel" in params) {
          const { channel: id, message } = params

          channels.update(id, (channel) => {
            channel.messageList.add(undefined, message, "system", Date.now())
          })
        }
      },
    }),
  )
}
