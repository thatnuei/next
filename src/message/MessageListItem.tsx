import { css } from "@emotion/react"
import { rgba } from "polished"
import React from "react"
import CharacterName from "../character/CharacterName"
import { Character } from "../character/types"
import {
  fontSize,
  inlineBlock,
  ml,
  mr,
  opacity,
  px,
  py,
  semiBlackBg,
} from "../ui/style"
import { emerald, tomato } from "../ui/theme.old"
import { MessageType } from "./types"

type Props = {
  sender?: Character
  text: string
  timestamp: number
  type: MessageType
}

export default function MessageListItem(props: Props) {
  const typeStyle = {
    normal: undefined,
    lfrp: lfrpStyle,
    admin: adminStyle,
    system: systemStyle,
  }[props.type]

  return (
    <div css={[px(3), py(2), typeStyle]}>
      <span css={messageStyle}>
        {new Date(props.timestamp).toLocaleTimeString()}
      </span>

      {props.sender && (
        <span css={[inlineBlock, mr(2)]}>
          <CharacterName {...props.sender} />
        </span>
      )}

      <span>{props.text}</span>
    </div>
  )
}

const messageStyle = [
  inlineBlock,
  opacity(0.5),
  fontSize("small"),
  ml(3),
  css({ float: "right" }),
]

const lfrpStyle = css({ backgroundColor: rgba(emerald, 0.2) })
const adminStyle = css({ backgroundColor: rgba(tomato, 0.2) })
const systemStyle = semiBlackBg(0.2)
