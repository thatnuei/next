import { useEffect, useMemo } from "react"
import { useChatContext } from "../chat/ChatContext"
import ChatInput from "../chat/ChatInput"
import { useDocumentVisible } from "../dom/document-visible"
import { useMediaQuery } from "../dom/useMediaQuery"
import MessageList from "../message/MessageList"
import MessageListItem from "../message/MessageListItem"
import type { MessageState } from "../message/MessageState"
import { createChannelMessage } from "../message/MessageState"
import { screenQueries } from "../ui/screens"
import ChannelHeader from "./ChannelHeader"
import ChannelUserList from "./ChannelUserList"
import { useActualChannelMode, useChannel, useChannelActions } from "./state"

type Props = {
  channelId: string
}

function ChannelView({ channelId }: Props) {
  const context = useChatContext()
  const channel = useChannel(channelId)
  const actualMode = useActualChannelMode(channelId)
  const actions = useChannelActions(channelId)
  const isLargeScreen = useMediaQuery(screenQueries.large)

  const messages = useMemo(() => {
    const shouldShowMessage = (message: MessageState) => {
      if (actualMode === "ads") {
        return message.type !== "normal" && message.type !== "action"
      }
      if (actualMode === "chat") {
        return message.type !== "lfrp"
      }
      return true
    }

    return channel.messages.filter(shouldShowMessage)
  }, [actualMode, channel.messages])

  const isDocumentVisible = useDocumentVisible()
  useEffect(() => {
    if (channel.isUnread && isDocumentVisible) actions.markRead()
  }, [actions, channel.isUnread, isDocumentVisible])

  return (
    <div className={`flex flex-col h-full`}>
      <ChannelHeader channelId={channelId} />

      <div className={`flex flex-1 min-h-0 my-1`}>
        <main className={`relative flex-1 bg-midnight-1`}>
          <MessageList messages={messages} />
        </main>

        {isLargeScreen && (
          <div className={`w-56 min-h-0 ml-1`}>
            <ChannelUserList channelId={channelId} />
          </div>
        )}
      </div>

      <ChatInput
        value={channel.input}
        onChangeText={actions.setInput}
        onSubmit={actions.sendMessage}
        maxLength={4096}
        renderPreview={(value) => (
          <MessageListItem
            message={{
              ...createChannelMessage(context.identity, value),
              timestamp: undefined,
            }}
          />
        )}
      />
    </div>
  )
}

export default ChannelView
