import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import ChatInput from "../chat/ChatInput"
import { useChatState } from "../chat/chatStateContext"
import { useChatStream } from "../chat/streamContext"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { PrivateChatState } from "./PrivateChatState"
import TypingStatusDisplay from "./TypingStatusDisplay"

type Props = {
  chat: PrivateChatState
} & TagProps<"div">

function PrivateChatView({ chat, ...props }: Props) {
  const state = useChatState()
  const stream = useChatStream()
  const character = state.characters.get(chat.partnerName)

  return (
    <div css={tw`flex flex-col`} {...props}>
      <div css={tw`flex flex-row items-center h-20 bg-background-0`}>
        <ChatMenuButton css={tw`ml-3`} />

        <CharacterMenuTarget name={chat.partnerName} css={tw`ml-3`}>
          <Avatar name={chat.partnerName} css={tw`w-12 h-12`} />
        </CharacterMenuTarget>

        <div
          css={tw`flex flex-col self-stretch justify-center flex-1 ml-3 overflow-y-auto`}
        >
          {/* need this extra container to keep the children from shrinking */}
          <div css={tw`my-3`}>
            <CharacterName character={character} />
            {/* the bottom margin needs to be here otherwise the scrolling flex column eats the bottom spacing */}
            <CharacterStatusText character={character} css={tw`mb-3`} />
          </div>
        </div>
      </div>

      <div css={tw`flex flex-col flex-1 mb-gap`}>
        <TypingStatusDisplay
          name={chat.partnerName}
          status={chat.typingStatus}
          css={chat.typingStatus === "clear" && tw`h-gap`}
        />
        <MessageList
          messages={chat.messageList.messages}
          css={tw`flex-1 bg-background-1`}
        />
      </div>

      <ChatInput
        value={chat.chatInput.value}
        onChangeText={chat.chatInput.set}
        onSubmit={(text) => {
          stream.send({
            type: "send-private-message",
            recipientName: chat.partnerName,
            text,
          })
        }}
      />
    </div>
  )
}

export default observer(PrivateChatView)
