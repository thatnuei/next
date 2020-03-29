import { css } from "@emotion/react"
import { observer } from "mobx-react-lite"
import { rgba } from "polished"
import React from "react"
import tw from "twin.macro"
import CharacterName from "../character/CharacterName"
import { useChatContext } from "../chat/context"
import { emerald, tomato } from "../ui/theme.old"
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
    <div css={[tw`px-3 py-2`, typeStyle]}>
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

      <span>{message.text}</span>
    </div>
  )
}

export default observer(MessageListItem)

const messageStyle = tw`inline-block float-right ml-3 text-sm opacity-50`
const lfrpStyle = css({ backgroundColor: rgba(emerald, 0.2) })
const adminStyle = css({ backgroundColor: rgba(tomato, 0.2) })
const systemStyle = tw`bg-black-faded`
