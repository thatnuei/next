import React from "react"
import { getProfileUrl } from "../flist/helpers"
import ExternalLink from "../ui/ExternalLink"
import { styled } from "../ui/styled"
import { useCharacterMenuContext } from "./CharacterMenuContext"
import { genderColors, statusColors } from "./colors"
import { CharacterStatus, Gender } from "./types"

type CharacterNameProps = {
  name: string
  gender: Gender
  status: CharacterStatus
}

const CharacterName = (props: CharacterNameProps) => {
  const menu = useCharacterMenuContext()

  const profileUrl = getProfileUrl(props.name)

  const nameStyle = { color: genderColors[props.gender] }
  const statusDotStyle = { backgroundColor: statusColors[props.status] }

  const openCharacterMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    menu.open(props.name, event)
  }

  return (
    <ContainerLink href={profileUrl} onContextMenu={openCharacterMenu}>
      <StatusDot title={`Status: ${props.status}`} style={statusDotStyle} />
      <NameText title={`${props.name} - ${props.gender}`} style={nameStyle}>
        {props.name}
      </NameText>
    </ContainerLink>
  )
}

export default React.memo(CharacterName)

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
