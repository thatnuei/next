import React from "react"
import { getProfileUrl } from "../flist/helpers"
import { styled } from "../ui/styled"
import { CharacterModel } from "./CharacterModel"
import { genderColors, statusColors } from "./colors"

type Props = {
  character: CharacterModel
}

export const CharacterName = (props: Props) => {
  const { name, gender, status } = props.character
  const genderColor = genderColors[gender]
  const statusColor = statusColors[status]

  return (
    <Container href={getProfileUrl(name)} target="_blank" rel="noopener noreferrer">
      <StatusDot style={{ color: statusColor }}>•</StatusDot>
      <Name style={{ color: genderColor }}>{name}</Name>
    </Container>
  )
}

const Container = styled.a`
  display: inline-block;
`

const StatusDot = styled.span`
  margin-right: 0.2rem;
  font-size: 120%;
  line-height: 0;
`

const Name = styled.span``
