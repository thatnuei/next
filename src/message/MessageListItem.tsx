import React from "react"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import CharacterName from "../character/CharacterName"
import { useChatState } from "../chat/chatStateContext"
import { TagProps } from "../jsx/types"
import { MessageModel } from "./MessageModel"

type Props = {
  message: MessageModel
} & TagProps<"div">

function MessageListItem({ message, ...props }: Props) {
  const state = useChatState()

  const typeStyle = {
    normal: undefined,
    action: tw`italic`,
    lfrp: tw`bg-green-faded`,
    warning: tw`bg-red-faded`,
    system: tw`bg-black-faded`,
  }[message.type]

  return (
    <div css={[tw`px-3 py-1`, typeStyle]} {...props}>
      <span css={tw`inline-block float-right ml-3 text-sm opacity-50`}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>

      {message.senderName && (
        <CharacterName
          character={state.characters.get(message.senderName)}
          css={[
            tw`inline-block`,
            message.type === "action" ? tw`mr-1` : tw`mr-2`,
          ]}
        />
      )}

      <BBC text={message.text} />
    </div>
  )
}

export default MessageListItem
