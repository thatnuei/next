import { observer } from "mobx-react-lite"
import React from "react"
import { styled } from "../../ui/styled"
import { useCharacter } from "../hooks"
import { genderColors, statusColors } from "./colors"

const CharacterName = (props: { name: string; hideStatusDot?: boolean }) => {
  const char = useCharacter(props.name)

  // const menu = useCharacterMenuContext()

  const nameStyle = { color: genderColors[char.gender] }
  const statusDotStyle = { backgroundColor: statusColors[char.status] }

  const openCharacterMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    // menu.open(props.name, event)
  }

  return (
    <ContainerButton onClick={openCharacterMenu}>
      {props.hideStatusDot ? null : (
        <StatusDot title={`Status: ${char.status}`} style={statusDotStyle} />
      )}
      <NameText title={`${props.name} - ${char.gender}`} style={nameStyle}>
        {props.name}
      </NameText>
    </ContainerButton>
  )
}

export default observer(CharacterName)

const ContainerButton = styled.button`
  display: inline-flex;
  align-items: baseline;
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
  align-self: center;
`
