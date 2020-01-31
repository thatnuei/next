import React from "react"
import BBC from "../bbc/BBC"
import { fontItalic, textSize } from "../ui/helpers.new"
import { statusColors } from "./colors"
import { CharacterStatus } from "./types"

type Props = {
  status: CharacterStatus
  statusMessage: string
}

function CharacterStatusDisplay({ status, statusMessage }: Props) {
  return (
    <span css={[fontItalic, textSize("sm")]}>
      <span css={{ color: statusColors[status] }}>{status}</span>
      {statusMessage ? (
        <>
          {" "}
          - <BBC text={statusMessage} />
        </>
      ) : null}
    </span>
  )
}

export default CharacterStatusDisplay
