import React from "react"
import tw from "twin.macro"
import CharacterName from "../character/CharacterName"
import { useChatContext } from "../chat/context"
import { MessageModel } from "./MessageModel"

type Props = {
  message: MessageModel
}

function MessageListItem({ message }: Props) {
  const { characterStore } = useChatContext()

  const typeStyle = {
    normal: undefined,
    lfrp: lfrpStyle,
    admin: adminStyle,
    system: systemStyle,
  }[message.type]

  return (
    <div css={[tw`px-3 py-1`, typeStyle]}>
      <span css={messageStyle}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>

      {message.senderName && (
        <span css={tw`inline-block mr-2`}>
          <CharacterName
            character={characterStore.getCharacter(message.senderName)}
          />
        </span>
      )}

      <span dangerouslySetInnerHTML={{ __html: message.text }} />
    </div>
  )
}

export default MessageListItem

const messageStyle = tw`inline-block float-right ml-3 text-sm opacity-50`
const lfrpStyle = tw`bg-green-faded`
const adminStyle = tw`bg-red-faded`
const systemStyle = tw`bg-black-faded`
