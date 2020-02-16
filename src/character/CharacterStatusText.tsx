import React from "react"
import { fontSize, italic, px, py, themeBgColor } from "../ui/style"
import { statusColors } from "./colors"
import { CharacterStatus } from "./types"

type Props = { status: CharacterStatus; statusMessage: string }

function CharacterStatusText(props: Props) {
  return (
    <p css={[px(3), py(2), themeBgColor(1), italic, fontSize("small")]}>
      <span css={{ color: statusColors[props.status] }}>{props.status}</span>
      {props.statusMessage ? ` - ${props.statusMessage}` : undefined}
    </p>
  )
}

export default CharacterStatusText
