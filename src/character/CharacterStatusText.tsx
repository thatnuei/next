import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { statusColors } from "./colors"
import { CharacterStatus } from "./types"

type Props = TagProps<"p"> & {
  status: CharacterStatus
  statusMessage: string
}

function CharacterStatusText({ status, statusMessage, ...props }: Props) {
  return (
    <p css={tw`italic text-sm`} {...props}>
      <span css={{ color: statusColors[status] }}>{status}</span>
      {statusMessage ? ` - ${statusMessage}` : undefined}
    </p>
  )
}

export default CharacterStatusText
