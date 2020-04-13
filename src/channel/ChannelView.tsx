import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import ChatInput from "../chat/ChatInput"
import { useChatStream } from "../chat/streamContext"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import Drawer from "../ui/Drawer"
import { scrollVertical } from "../ui/helpers"
import Modal from "../ui/Modal"
import { OverlayState } from "../ui/OverlayState"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import ChannelHeader from "./ChannelHeader"
import { ChannelState } from "./ChannelState"
import ChannelUserList from "./ChannelUserList"

type Props = {
  channel: ChannelState
} & TagProps<"div">

function ChannelView({ channel, ...props }: Props) {
  const stream = useChatStream()
  const isLargeScreen = useMediaQuery(screenQueries.large)
  const descriptionOverlay = useMemo(() => new OverlayState(), [])
  const userListDrawer = useMemo(() => new OverlayState(), [])

  function handleChatInputSubmit(text: string) {
    stream.send({
      type: "send-channel-message",
      channelId: channel.id,
      text,
    })
  }

  return (
    <div css={tw`flex flex-col`} {...props}>
      <ChannelHeader
        channel={channel}
        onToggleDescription={descriptionOverlay.toggle}
        onShowUsers={userListDrawer.show}
      />

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap`}>
        <main css={tw`relative flex-1 bg-background-1`}>
          <MessageList
            list={channel.messageList}
            filter={(it) => channel.shouldShowMessage(it.type)}
            css={tw`w-full h-full`}
          />

          <Modal
            title="Description"
            width="100%"
            height="max(60%, 500px)"
            state={descriptionOverlay}
            fillMode="absolute"
            verticalPanelAlign="top"
          >
            <div css={[tw`w-full h-full`, scrollVertical]}>
              <p css={tw`p-4`}>
                <BBC text={channel.description} />
              </p>
            </div>
          </Modal>
        </main>

        {isLargeScreen && (
          <ChannelUserList channel={channel} css={tw`w-56 min-h-0 ml-gap`} />
        )}
      </div>

      <ChatInput
        inputModel={channel.chatInput}
        onSubmit={handleChatInputSubmit}
      />

      {!isLargeScreen && (
        <Drawer state={userListDrawer} side="right">
          <div css={tw`flex flex-col h-full bg-background-2`}>
            <ChannelUserList channel={channel} css={tw`flex-1 w-56`} />
            <div css={tw`h-gap`} />
            <ChannelFilters channel={channel} css={tw`p-2 bg-background-0`} />
          </div>
        </Drawer>
      )}
    </div>
  )
}

export default observer(ChannelView)
