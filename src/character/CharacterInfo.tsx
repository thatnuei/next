import React, { ComponentPropsWithoutRef } from "react"
import { getProfileUrl } from "../flist/helpers"
import { useRootStore } from "../RootStore"
import { semiBlack } from "../ui/colors"
import ExternalLink from "../ui/ExternalLink"
import { styled } from "../ui/styled"
import Avatar from "./Avatar"
import { genderColors, statusColors } from "./colors"

type CharacterInfoProps = ComponentPropsWithoutRef<"div"> & {
  name: string
}

const CharacterInfo = ({ name, ...containerProps }: CharacterInfoProps) => {
  const { characterStore } = useRootStore()
  const { gender, status, statusMessage } = characterStore.characters.get(name)

  const nameStyle = { color: genderColors[gender] }
  const statusStyle = { color: statusColors[status] }

  return (
    <Container {...containerProps}>
      <ExternalLink href={getProfileUrl(name)}>
        <NameText style={nameStyle} title={`${name} (${gender})`}>
          {name}
        </NameText>
      </ExternalLink>

      <Avatar key={name} name={name} size={80} />

      <StatusText>
        <span style={statusStyle}>{status}</span>
        <span>{statusMessage ? ` - ${statusMessage}` : ""}</span>
      </StatusText>
    </Container>
  )
}

export default CharacterInfo

const Container = styled.div`
  padding: 0.5rem;

  display: grid;
  grid-gap: 0.5rem;
`

const NameText = styled.h3`
  font-weight: 500;
  font-size: 24px;
`

const StatusText = styled.p`
  background-color: ${semiBlack(0.3)};
  font-size: 0.7rem;
  font-style: italic;
  padding: 0.5rem;
`
