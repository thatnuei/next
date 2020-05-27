import { useOpenChannelBrowserAction } from "../channelBrowser/state"
import { useChatState } from "../chat/chatStateContext"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatSocket, useChatSocketListener } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
import { useChatNav } from "../chatNav/state"
import {
  createAdMessage,
  createChannelMessage,
  createSystemMessage,
} from "../message/MessageState"
import { useStreamListener } from "../state/stream"
import { loadChannels, saveChannels } from "./storage"

export function useChannelListeners() {
  const state = useChatState()
  const { channels } = state

  const chatStream = useChatStream()
  const socket = useChatSocket()
  const { account, identity } = useChatCredentials()
  const nav = useChatNav()
  const openChannelBrowser = useOpenChannelBrowserAction()

  useStreamListener(chatStream, (event) => {
    if (event.type === "join-channel") {
      if (channels.get(event.id).joinState === "absent") {
        channels.update(event.id, (channel) => {
          channel.joinState = "joining"
          if (event.title) channel.title = event.title
        })
        socket.send({ type: "JCH", params: { channel: event.id } })
      }
    }

    if (event.type === "leave-channel") {
      if (channels.get(event.id).joinState === "present") {
        channels.update(event.id, (channel) => {
          channel.joinState = "leaving"
        })
        socket.send({ type: "LCH", params: { channel: event.id } })
        saveChannels(state, account, identity)
      }
    }

    if (event.type === "send-channel-message") {
      channels.update(event.channelId, (channel) => {
        channel.messageList.add(createChannelMessage(identity, event.text))
      })
      socket.send({
        type: "MSG",
        params: { channel: event.channelId, message: event.text },
      })
    }
  })

  useChatSocketListener({
    async IDN() {
      const channels = await loadChannels(account, identity)
      if (channels.length === 0) {
        openChannelBrowser()
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
        channel.messageList.add(createChannelMessage(character, message))

        if (nav.currentChannel !== channel) {
          channel.isUnread = true
        }
      })
    },

    LRP({ channel: id, character, message }) {
      channels.update(id, (channel) => {
        channel.messageList.add(createAdMessage(character, message))
      })
    },

    RLL(params) {
      if ("channel" in params) {
        const { channel: id, message } = params

        channels.update(id, (channel) => {
          channel.messageList.add(createSystemMessage(message))
        })
      }
    },
  })
}
