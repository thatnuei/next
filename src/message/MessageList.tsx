import { css } from "@emotion/react"
import React from "react"
import CharacterName from "../character/CharacterName"
import {
  fontSize,
  inlineBlock,
  mb,
  ml,
  mr,
  opacity,
  px,
  py,
  scrollVertical,
  size,
} from "../ui/style"
import { Message } from "./types"

type Props = { messages: Message[] }

function MessageList({ messages }: Props) {
  return (
    <ol css={[size("full"), py(2), px(3), scrollVertical]}>
      {messages.map((message, i) => (
        <li key={i} css={mb(2)}>
          <span css={messageStyle}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          <span css={[inlineBlock, mr(2)]}>
            <CharacterName {...message.sender} />
          </span>
          <span>{message.text}</span>
        </li>
      ))}
    </ol>
  )
}

export default MessageList

const messageStyle = [
  inlineBlock,
  opacity(0.5),
  fontSize("small"),
  ml(3),
  css({ float: "right" }),
]
