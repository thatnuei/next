import { AnimatePresence } from "framer-motion"
import { useObservable } from "micro-observables"
import React from "react"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import ChatInput from "../chat/ChatInput"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { MessageType } from "../message/MessageState"
import { useRootStore } from "../root/context"
import Drawer from "../ui/Drawer"
import { scrollVertical } from "../ui/helpers"
import Modal from "../ui/Modal"
import { useOverlay } from "../ui/overlay"
import { screenQueries } from "../ui/screens"
import ChannelHeader from "./ChannelHeader"
import ChannelUserList from "./ChannelUserList"
import { useChannel } from "./helpers"

type Props = {
  channelId: string
} & TagProps<"div">

function ChannelView({ channelId, ...props }: Props) {
  const root = useRootStore()
  const channel = useChannel(channelId)
  const messages = useObservable(channel.messages)
  const description = useObservable(channel.description)
  const chatInput = useObservable(channel.chatInput)
  const actualMode = useObservable(channel.actualMode)

  const isLargeScreen = useMediaQuery(screenQueries.large)
  const descriptionOverlay = useOverlay()
  const userList = useOverlay()

  function shouldShowMessage(messageType: MessageType) {
    if (actualMode === "ads") {
      return messageType !== "normal" && messageType !== "action"
    }

    if (actualMode === "chat") {
      return messageType !== "lfrp"
    }

    return true
  }

  function updateChatInput(chatInput: string) {
    channel.chatInput.set(chatInput)
  }

  function submitChatInput(text: string) {
    root.channelStore.sendMessage(channelId, text)
  }

  return (
    <div css={tw`flex flex-col`} {...props}>
      <ChannelHeader
        channelId={channelId}
        onToggleDescription={descriptionOverlay.toggle}
        onShowUsers={userList.show}
      />

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap`}>
        <main css={tw`relative flex-1 bg-background-1`}>
          <MessageList
            messages={messages.filter((msg) => shouldShowMessage(msg.type))}
            css={tw`w-full h-full`}
          />

          <Modal
            title="Description"
            width="100%"
            height="max(60%, 500px)"
            {...descriptionOverlay.props}
            fillMode="contained"
            verticalPanelAlign="top"
          >
            <div css={[tw`w-full h-full`, scrollVertical]}>
              <p css={tw`p-4`}>
                <BBC text={description} />
              </p>
            </div>
          </Modal>
        </main>

        {isLargeScreen && (
          <ChannelUserList channel={channel} css={tw`w-56 min-h-0 ml-gap`} />
        )}
      </div>

      <ChatInput
        value={chatInput}
        onChangeText={updateChatInput}
        onSubmit={submitChatInput}
      />

      <AnimatePresence>
        {!isLargeScreen && userList.value && (
          <Drawer side="right" onDismiss={userList.hide}>
            <ChannelUserList
              channel={channel}
              css={tw`w-56 h-full bg-background-2`}
            />
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChannelView
