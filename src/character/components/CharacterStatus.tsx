import React from "react"
import BBC from "../../bbc/BBC"
import { useSelector } from "../../store/hooks"
import { getCharacter } from "../../store/selectors"
import { styled } from "../../ui/styled"
import { statusColors } from "./colors"

type Props = { name: string }

function CharacterStatus({ name }: Props) {
  const { status, statusMessage } = useSelector(getCharacter(name))
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
