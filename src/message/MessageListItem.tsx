import { css } from "@emotion/react"
import { rgba } from "polished"
import React from "react"
import tw from "twin.macro"
import { emerald, tomato } from "../ui/theme.old"
import { MessageModel } from "./MessageModel"

type Props = {
  message: MessageModel
}

export default function MessageListItem({ message }: Props) {
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
          {message.senderName}
          {/* <CharacterName {...message.sender} /> */}
        </span>
      )}

      <span>{message.text}</span>
    </div>
  )
}

const messageStyle = tw`inline-block float-right ml-3 text-sm opacity-50`
const lfrpStyle = css({ backgroundColor: rgba(emerald, 0.2) })
const adminStyle = css({ backgroundColor: rgba(tomato, 0.2) })
const systemStyle = tw`bg-shade`
