import { observer } from "mobx-react-lite"
import React from "react"
import { useRootStore } from "../RootStore"
import BBC from "../chat/BBC"
import { styled } from "../ui/styled"
import { statusColors } from "./colors"

type Props = { name: string }

function CharacterStatus({ name }: Props) {
  const { characterStore } = useRootStore()
  const { status, statusMessage } = characterStore.characters.get(name)
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
