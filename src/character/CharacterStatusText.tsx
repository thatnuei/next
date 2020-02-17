import React from "react"
import { fontSize, italic } from "../ui/style"
import { statusColors } from "./colors"
import { CharacterStatus } from "./types"

type Props = { status: CharacterStatus; statusMessage: string }

function CharacterStatusText(props: Props) {
  return (
    <p css={[italic, fontSize("small")]}>
      <span css={{ color: statusColors[props.status] }}>{props.status}</span>
      {props.statusMessage ? ` - ${props.statusMessage}` : undefined}
    </p>
  )
}

export default CharacterStatusText
