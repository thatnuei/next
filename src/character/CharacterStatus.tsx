import * as fchat from "fchat"
import React from "react"
import { statusColors } from "./colors"

type Props = {
  status: fchat.Character.Status
  statusMessage: string
}

export const CharacterStatus = (props: Props) => {
  const statusColor = statusColors[props.status]
  return (
    <>
      <span style={{ color: statusColor }}>{props.status}</span>
      {props.statusMessage.trim() ? ` - ${props.statusMessage}` : null}
    </>
  )
}
