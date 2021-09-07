import { useMemo } from "react"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import { useChatContext } from "../chat/ChatContext"
import ChatInput from "../chat/ChatInput"
import ChatMenuButton from "../chat/ChatMenuButton"
import MessageList from "../message/MessageList"
import MessageListItem from "../message/MessageListItem"
import { createPrivateMessage } from "../message/MessageState"
import { useEmitterListener } from "../state/emitter"
import { combineStores, createStore, useStoreValue } from "../state/store"
import TypingStatusDisplay from "./TypingStatusDisplay"

const documentVisibleStore = createStore(document.visibilityState === "visible")

document.addEventListener("visibilitychange", () => {
  documentVisibleStore.set(document.visibilityState === "visible")
})

export default function PrivateChatView({
  partnerName,
}: {
  partnerName: string
}) {
  const context = useChatContext()

  const chat = useStoreValue(
    context.privateChatStore.privateChats.selectItem(partnerName),
  )

  const allMessages = useMemo(
    () => [...(chat.previousMessages ?? []), ...chat.messages],
    [chat.previousMessages, chat.messages],
  )

  const isUnread = context.privateChatStore.privateChats
    .selectItem(partnerName)
    .select((it) => it.isUnread)

  useEmitterListener(
    combineStores(isUnread, documentVisibleStore),
    ([isUnread, documentVisible]) => {
      if (isUnread && documentVisible) {
        context.privateChatStore.markRead(partnerName)
      }
    },
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row h-20 gap-3 pl-3 mb-1 bg-midnight-0">
        <ChatMenuButton />

        <div className="self-center">
          <CharacterMenuTarget name={partnerName}>
            <Avatar name={partnerName} size={12} />
          </CharacterMenuTarget>
        </div>

        <div className="flex flex-col flex-1 py-3 overflow-y-auto">
          <div className="pr-3 my-auto">
            <CharacterName name={partnerName} statusDot="hidden" />
            <CharacterStatusText name={partnerName} />
          </div>
        </div>
      </div>

      {/* min height 0 needed on both places here to not overstretch the parent */}
      <div className="flex flex-col flex-1 min-h-0 mb-1">
        <TypingStatusDisplay name={partnerName} status={chat.typingStatus} />
        <div className="flex-1 min-h-0 bg-midnight-1">
          <MessageList messages={allMessages} />
        </div>
      </div>

      <ChatInput
        value={chat.input}
        maxLength={50000}
        onChangeText={(input) =>
          context.privateChatStore.setInput(partnerName, input)
        }
        onSubmit={(message) => {
          context.privateChatStore.sendMessage(partnerName, message)
          context.privateChatStore.setInput(partnerName, "")
        }}
        renderPreview={(value) => (
          <MessageListItem
            message={{
              ...createPrivateMessage(context.identity, value),
              timestamp: undefined,
            }}
          />
        )}
      />
    </div>
  )
}
