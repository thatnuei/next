import React from "react"
import { getProfileUrl } from "../flist/helpers"
import { semiBlack, themeColor } from "../ui/colors"
import ExternalLink from "../ui/ExternalLink"
import Icon from "../ui/Icon"
import { keyframes, styled } from "../ui/styled"
import { useCharacterMenuContext } from "./CharacterMenuContext"

type CharacterMenuProps = {
  characterName: string
}

const CharacterMenu = (props: CharacterMenuProps) => {
  const menu = useCharacterMenuContext()

  return (
    <Menu onClick={menu.close}>
      <MenuOption
        as={ExternalLink}
        href={getProfileUrl(props.characterName)}
        autoFocus
      >
        <Icon icon="user" />
        <span>Profile</span>
      </MenuOption>

      <MenuOption>
        <Icon icon="message" />
        <span>Open Private Message</span>
      </MenuOption>

      <MenuOption>
        <Icon icon="bookmark" />
        <span>Bookmark</span>
      </MenuOption>

      <MenuOption>
        <Icon icon="ignore" />
        <span>Ignore</span>
      </MenuOption>

      <MenuOption>
        <Icon icon="report" />
        <span>Report</span>
      </MenuOption>
    </Menu>
  )
}

export default CharacterMenu

const slideDown = keyframes`
  from {
    transform: translateY(-1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const Menu = styled.div`
  background-color: ${themeColor};
  display: grid;
  animation: 0.2s ${slideDown};
`

const MenuOption = styled.button<{ href?: string }>`
  padding: 0.4rem;
  padding-right: 0.7rem;
  opacity: 0.6;
  cursor: pointer;
  transition: 0.2s;

  :hover,
  :focus {
    opacity: 1;
    background-color: ${semiBlack(0.25)};
  }

  display: grid;
  grid-auto-flow: column;
  grid-gap: 5px;
  align-items: center;
  justify-content: start;
`
