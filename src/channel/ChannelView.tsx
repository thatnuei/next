import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import ChatInput from "../chat/ChatInput"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import HookScope from "../react/HookScope"
import Drawer from "../ui/Drawer"
import { scrollVertical } from "../ui/helpers"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import ChannelHeader from "./ChannelHeader"
import ChannelUserList from "./ChannelUserList"
import {
  channelAtom,
  channelMessagesAtom,
  shouldShowMessage,
  useSendChannelMessageAction,
} from "./state"

type Props = {
  channelId: string
} & TagProps<"div">

function ChannelView({ channelId, ...props }: Props) {
  const [channel, setChannel] = useRecoilState(channelAtom(channelId))
  const isLargeScreen = useMediaQuery(screenQueries.large)
  const [userListVisible, setUserListVisible] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const sendMessage = useSendChannelMessageAction()

  function updateChatInput(chatInput: string) {
    setChannel((prev) => ({ ...prev, chatInput }))
  }

  function submitChatInput(text: string) {
    sendMessage(channelId, text)
  }

  return (
    <div css={tw`flex flex-col`} {...props}>
      <ChannelHeader
        channelId={channelId}
        onToggleDescription={() => setDescriptionVisible((v) => !v)}
        onShowUsers={() => setUserListVisible(true)}
      />

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap`}>
        <main css={tw`relative flex-1 bg-background-1`}>
          <HookScope>
            {function useScope() {
              const messages = useRecoilValue(channelMessagesAtom(channelId))
              return (
                <MessageList
                  messages={messages.filter((msg) =>
                    shouldShowMessage(channel, msg.type),
                  )}
                  css={tw`w-full h-full`}
                />
              )
            }}
          </HookScope>

          <Modal
            title="Description"
            width="100%"
            height="max(60%, 500px)"
            isVisible={descriptionVisible}
            onDismiss={() => setDescriptionVisible(false)}
            fillMode="contained"
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
        value={channel.chatInput}
        onChangeText={updateChatInput}
        onSubmit={submitChatInput}
      />

      {!isLargeScreen && (
        <Drawer
          isVisible={userListVisible}
          onDismiss={() => setUserListVisible(false)}
          side="right"
        >
          <ChannelUserList
            channel={channel}
            css={tw`w-56 h-full bg-background-2`}
          />
        </Drawer>
      )}
    </div>
  )
}

export default ChannelView
