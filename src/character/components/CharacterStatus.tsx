import React from "react"
import BBC from "../../bbc/BBC"
import { styled } from "../../ui/styled"
import { CharacterStatus as CharacterStatusType } from "../types"
import { statusColors } from "./colors"

type Props = {
  status: CharacterStatusType
  statusMessage: string
}

function CharacterStatus({ status, statusMessage }: Props) {
  const statusStyle = { color: statusColors[status] }

  return (
    <StatusText>
      <span style={statusStyle}>{status}</span>
      {statusMessage ? (
        <>
          {" "}
          - <BBC text={statusMessage} />
        </>
      ) : null}
    </StatusText>
  )
}

export default CharacterStatus

const StatusText = styled.span`
  font-style: italic;
  font-size: 80%;
`
