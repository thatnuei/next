import React from "react"
import { TagProps } from "../jsx/types"
import { fontSize, italic } from "../ui/style"
import { statusColors } from "./colors"
import { CharacterStatus } from "./types"

type Props = TagProps<"p"> & {
  status: CharacterStatus
  statusMessage: string
}

function CharacterStatusText({ status, statusMessage, ...props }: Props) {
  return (
    <p css={[italic, fontSize("small")]} {...props}>
      <span css={{ color: statusColors[status] }}>{status}</span>
      {statusMessage ? ` - ${statusMessage}` : undefined}
    </p>
  )
}

export default CharacterStatusText
