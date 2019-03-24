import React from "react"
import { getProfileUrl } from "../flist/helpers"
import { semiBlack, themeColor } from "../ui/colors"
import ExternalLink from "../ui/ExternalLink"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import CharacterInfo from "./CharacterInfo"
import { useCharacterMenuContext } from "./CharacterMenuContext"

type CharacterMenuProps = {
  characterName: string
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

const CharacterMenu = (props: CharacterMenuProps) => {
  const menu = useCharacterMenuContext()

  const profileUrl = getProfileUrl(props.characterName)

  return (
    <Menu onClick={menu.close}>
      <CharacterInfo name={props.characterName} onClick={stopPropagation} />

      <OptionsBackground>
        <MenuOption as={ExternalLink} href={profileUrl} autoFocus>
          <Icon icon="user" />
          <span>Profile</span>
        </MenuOption>

        <MenuOption>
          <Icon icon="message" />
          <span>Message</span>
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
      </OptionsBackground>
    </Menu>
  )
}

export default CharacterMenu

const Menu = styled.div`
  background-color: ${themeColor};

  width: 200px;
  max-width: 100%;
`

const OptionsBackground = styled.div`
  background-color: ${semiBlack(0.2)};
  display: grid;
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
