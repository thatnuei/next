import React from "react"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import CharacterName from "../character/CharacterName"
import { TagProps } from "../jsx/types"
import { MessageState } from "./MessageState"

type Props = {
  message: MessageState
} & TagProps<"div">

function MessageListItem({ message, ...props }: Props) {
  const typeStyle = {
    normal: undefined,
    action: tw`italic`,
    lfrp: tw`bg-green-faded`,
    warning: tw`bg-red-faded`,
    system: tw`bg-black-faded`,
  }[message.type]

  return (
    <div css={[tw`px-3 py-1`, typeStyle]} {...props}>
      <span
        css={tw`inline-block float-right ml-3 text-sm not-italic opacity-50`}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>

      {message.senderName && (
        <CharacterName
          name={message.senderName}
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
