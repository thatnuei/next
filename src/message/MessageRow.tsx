import { Interpolation } from "@emotion/core"
import React from "react"
import CharacterName from "../character/CharacterName"
import { Character } from "../character/types"
import { semiBlack } from "../ui/colors"
import { css } from "../ui/styled"
import { MessageType } from "./types"

type MessageRowProps = {
  sender?: Character
  text: string
  type: MessageType
}

const actionRegex = /^\s*\/me\s*/

const MessageRow = ({ sender, text, type }: MessageRowProps) => {
  const isAction = actionRegex.test(text)
  const parsedText = text.replace(actionRegex, "")

  return (
    <div css={[containerStyle, highlightStyles[type], isAction && actionStyle]}>
      <span css={senderStyle}>{sender && <CharacterName {...sender} />}</span>
      {parsedText}
    </div>
  )
}

export default React.memo(
  MessageRow,
  (prev, next) =>
    prev.sender != null &&
    next.sender != null &&
    prev.sender.status === next.sender.status,
)

const highlightStyles: { [K in MessageType]?: Interpolation } = {
  lfrp: { backgroundColor: "rgba(39, 174, 96, 0.2)" },
  system: { backgroundColor: semiBlack(0.5) },
  admin: { backgroundColor: "rgb(192, 57, 43, 0.2)" },
}

const containerStyle = css`
  padding: 4px 12px;
`

const senderStyle = css`
  margin-right: 8px;
`

const actionStyle = css`
  font-style: italic;
`
