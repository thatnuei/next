import { observer } from "mobx-react-lite"
import React from "react"
import { styled } from "../../ui/styled"
import { Character } from "../types"
import { genderColors, statusColors } from "./colors"

type Props = {
  character: Character
  hideStatusDot?: boolean
}

function CharacterName({ character, hideStatusDot }: Props) {
  const { name, gender, status } = character
  const nameStyle = { color: genderColors[gender] }
  const statusDotStyle = { backgroundColor: statusColors[status] }

  // const openCharacterMenu = (event: React.MouseEvent) => {
  //   event.preventDefault()

  //   root.characterStore.showCharacterMenu(props.name, {
  //     x: event.clientX,
  //     y: event.clientY,
  //   })
  // }

  return (
    <ContainerButton>
      {hideStatusDot ? null : (
        <StatusDot title={`Status: ${status}`} style={statusDotStyle} />
      )}
      <NameText title={`${name} - ${gender}`} style={nameStyle}>
        {name}
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
