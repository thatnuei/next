import React from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import ChatInput from "../chat/ChatInput"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import {
  privateChatAtom,
  privateChatInputAtom,
  privateChatMessagesAtom,
  useSendPrivateMessageAction,
} from "./state"
import TypingStatusDisplay from "./TypingStatusDisplay"

type Props = {
  partnerName: string
} & TagProps<"div">

function PrivateChatView({ partnerName, ...props }: Props) {
  const chat = useRecoilValue(privateChatAtom(partnerName))
  const messages = useRecoilValue(privateChatMessagesAtom(partnerName))
  const [input, setInput] = useRecoilState(privateChatInputAtom(partnerName))
  const sendMessage = useSendPrivateMessageAction()

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
            <CharacterName name={chat.partnerName} />
            {/* the bottom margin needs to be here otherwise the scrolling flex column eats the bottom spacing */}
            <CharacterStatusText name={chat.partnerName} css={tw`mb-3`} />
          </div>
        </div>
      </div>

      <div css={tw`flex flex-col flex-1 mb-gap`}>
        <TypingStatusDisplay
          name={chat.partnerName}
          status={chat.typingStatus}
          css={chat.typingStatus === "clear" && tw`h-gap`}
        />
        <MessageList messages={messages} css={tw`flex-1 bg-background-1`} />
      </div>

      <ChatInput
        value={input}
        onChangeText={setInput}
        onSubmit={(text) => sendMessage(chat.partnerName, text)}
      />
    </div>
  )
}

export default PrivateChatView
