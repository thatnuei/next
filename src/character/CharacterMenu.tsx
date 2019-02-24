import React from "react"
import { getProfileUrl } from "../flist/helpers"
import Button, { buttonStyle } from "../ui/Button"
import { themeColor } from "../ui/colors"
import ExternalLink from "../ui/ExternalLink"
import { flex } from "../ui/flex"
import { boxShadow } from "../ui/helpers"
import { css, keyframes } from "../ui/styled"
import { useCharacterMenuContext } from "./CharacterMenuContext"

type CharacterMenuProps = {
  characterName: string
}

const CharacterMenu = (props: CharacterMenuProps) => {
  const menu = useCharacterMenuContext()

  return (
    <div
      css={[
        flex({ direction: "column" }),
        css`
          background-color: ${themeColor};
        `,
        boxShadow,
        slideDown,
      ]}
      onClick={menu.close}
    >
      <ExternalLink css={buttonStyle} href={getProfileUrl(props.characterName)}>
        Profile
      </ExternalLink>
      <Button>Open Private Message</Button>
      <Button>Bookmark</Button>
      <Button>Ignore</Button>
      <Button>Report</Button>
    </div>
  )
}

export default CharacterMenu

const slideDownKeyframes = keyframes`
  from {
    transform: translateY(-1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const slideDown = css`
  animation: ${slideDownKeyframes} 0.2s;
`
