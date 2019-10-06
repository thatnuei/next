import { observer } from "mobx-react-lite"
import React from "react"
import BBC from "../../bbc/BBC"
import { styled } from "../../ui/styled"
import { useCharacter } from "../hooks"
import { statusColors } from "./colors"

type Props = { name: string }

function CharacterStatus({ name }: Props) {
  const { status, statusMessage } = useCharacter(name)
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

export default observer(CharacterStatus)

const StatusText = styled.span`
  font-style: italic;
  font-size: 80%;
`
