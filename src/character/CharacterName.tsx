import React from "react"
import { getProfileUrl } from "../flist/helpers"
import ExternalLink from "../ui/ExternalLink"
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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    menu.open(props.name, event)
  }

  return (
    <ExternalLink
      href={getProfileUrl(props.name)}
      css={containerStyle}
      onContextMenu={handleContextMenu}
    >
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
    </ExternalLink>
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
