import React from "react"
import { getProfileUrl } from "../flist/helpers"
import { SessionConsumer } from "../session/SessionContext"
import { styled } from "../ui/styled"
import { CharacterModel } from "./CharacterModel"
import { genderColors, statusColors } from "./colors"

type Props = {
  character: CharacterModel
}

const CharacterNameView = (props: Props) => {
  const { name, gender, status } = props.character
  const genderColor = genderColors[gender]
  const statusColor = statusColors[status]

  return (
    <Container href={getProfileUrl(name)} target="_blank" rel="noopener noreferrer">
      <StatusDot color={statusColor}>•</StatusDot>
      <Name color={genderColor}>{name}</Name>
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
  color: ${(props: { color: string }) => props.color};
`

const Name = styled.span`
  color: ${(props: { color: string }) => props.color};
`

export const CharacterName = (props: { name: string }) => (
  <SessionConsumer>
    {(session) => <CharacterNameView character={session.characters.getCharacter(props.name)} />}
  </SessionConsumer>
)
