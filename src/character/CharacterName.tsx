import React from "react"
import { css } from "../ui/styled"
import { genderColors, statusColors } from "./colors"
import { CharacterStatus, Gender } from "./types"

type CharacterNameProps = {
  name: string
  gender: Gender
  status: CharacterStatus
}

const CharacterName = (props: CharacterNameProps) => {
  return (
    <a href="#" css={containerStyle}>
      <span
        css={[statusDotStyle, { backgroundColor: statusColors[props.status] }]}
      />
      <span css={[nameStyle, { color: genderColors[props.gender] }]}>
        {props.name}
      </span>
    </a>
  )
}

export default CharacterName

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
