import React from "react"
import { css } from "../ui/styled"
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

  return (
    <button css={containerStyle} onClick={menu.handleTargetClick}>
      <span
        css={[statusDotStyle, { backgroundColor: statusColors[props.status] }]}
        title={`Status: ${props.status}`}
      />
      <span
        title={`${props.name} - ${props.gender}`}
        css={[nameStyle, { color: genderColors[props.gender] }]}
      >
        {props.name}
      </span>
    </button>
  )
}

export default React.memo(CharacterName)

const containerStyle = css`
  display: inline-flex;
  align-items: center;
  vertical-align: top;
`

const nameStyle = css`
  font-weight: 500;
`

const statusDotStyle = css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
`
