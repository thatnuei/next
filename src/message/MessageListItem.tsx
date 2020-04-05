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
    lfrp: lfrpStyle,
    admin: adminStyle,
    system: systemStyle,
  }[message.type]

  return (
    <div css={[tw`px-3 py-1`, typeStyle]} {...props}>
      <span css={messageStyle}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>

      {message.senderName && (
        <span css={tw`inline-block mr-2`}>
          <CharacterName character={state.characters.get(message.senderName)} />
        </span>
      )}

      <BBC text={message.text} />
    </div>
  )
}

export default MessageListItem

const messageStyle = tw`inline-block float-right ml-3 text-sm opacity-50`
const lfrpStyle = tw`bg-green-faded`
const adminStyle = tw`bg-red-faded`
const systemStyle = tw`bg-black-faded`
