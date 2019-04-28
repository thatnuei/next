import React from "react"
import { getProfileUrl } from "../flist/helpers"
import { useRootStore } from "../RootStore"
import ExternalLink from "../ui/ExternalLink"
import { styled } from "../ui/styled"
import { useCharacterMenuContext } from "./CharacterMenuContext"
import { genderColors, statusColors } from "./colors"

const CharacterName = (props: { name: string }) => {
  const { characterStore } = useRootStore()
  const char = characterStore.characters.get(props.name)

  const menu = useCharacterMenuContext()

  const profileUrl = getProfileUrl(props.name)

  const nameStyle = { color: genderColors[char.gender] }
  const statusDotStyle = { backgroundColor: statusColors[char.status] }

  const openCharacterMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    menu.open(props.name, event)
  }

  return (
    <ContainerLink href={profileUrl} onContextMenu={openCharacterMenu}>
      <StatusDot title={`Status: ${char.status}`} style={statusDotStyle} />
      <NameText title={`${props.name} - ${char.gender}`} style={nameStyle}>
        {props.name}
      </NameText>
    </ContainerLink>
  )
}

export default CharacterName

const ContainerLink = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  vertical-align: top;
`

const NameText = styled.span`
  font-weight: 500;
`

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  flex-shrink: 0; /* prevents being squished when word-wrapping */
`
