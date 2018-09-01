import { observer } from "mobx-react"
import React from "react"
import { styled } from "../ui/styled"
import { Avatar } from "./Avatar"
import { CharacterModel } from "./CharacterModel"
import { genderColors, statusColors } from "./colors"

type Props = {
  character: CharacterModel
}

export const CharacterInfo = observer((props: Props) => {
  const { name, gender, status, statusMessage } = props.character

  const nameColor = genderColors[gender]
  const statusColor = statusColors[status]

  return (
    <div>
      <Name style={{ color: nameColor }}>{name}</Name>
      <AvatarContainer>
        <Avatar name={name} />
      </AvatarContainer>
      <Status>
        <span style={{ color: statusColor }}>{status}</span>
        {statusMessage.trim() ? ` - ${statusMessage}` : ""}
      </Status>
    </div>
  )
})

const Name = styled.h1`
  margin-bottom: 0.5rem;
`

const AvatarContainer = styled.div`
  margin-bottom: 0.5rem;
`

const Status = styled.div`
  font-size: 80%;
  font-style: italic;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
`
