import React from "react";
import { getProfileUrl } from "../flist/helpers";
import { useRootStore } from "../RootStore";
import Box from "../ui/Box";
import { semiBlack } from "../ui/colors";
import ExternalLink from "../ui/ExternalLink";
import FadedButton from "../ui/FadedButton";
import Icon from "../ui/Icon";
import { styled } from "../ui/styled";
import { gapSizes } from "../ui/theme";
import CharacterInfo from "./CharacterInfo";
import { useCharacterMenuContext } from "./CharacterMenuContext";

type CharacterMenuProps = {
  characterName: string
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

const CharacterMenu = (props: CharacterMenuProps) => {
  const menu = useCharacterMenuContext()
  const { privateChatStore, viewStore } = useRootStore()

  const profileUrl = getProfileUrl(props.characterName)

  const handleMessage = () => {
    privateChatStore.openChat(props.characterName)
    viewStore.showPrivateChat(props.characterName)
  }

  return (
    <Menu background="theme0" onClick={menu.close} width={200} elevated>
      <CloseButton>
        <Icon icon="close" />
      </CloseButton>

      <Box pad={gapSizes.small}>
        <CharacterInfo name={props.characterName} onClick={stopPropagation} />
      </Box>

      <OptionsBackground>
        <MenuOption as={ExternalLink} href={profileUrl}>
          <Icon icon="user" />
          <span>Profile</span>
        </MenuOption>

        <MenuOption onClick={handleMessage}>
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

const Menu = styled(Box)`
  position: relative;
`

const OptionsBackground = styled.div`
  background-color: ${semiBlack(0.2)};
  display: grid;
`

const MenuOption = styled.button<{ href?: string }>`
  padding: 0.4rem;
  padding-right: 0.7rem;
  opacity: 0.6;
  transition: 0.2s;

  :hover {
    opacity: 1;
    background-color: ${semiBlack(0.25)};
  }

  display: flex;
  > * + * {
    margin-left: ${gapSizes.xsmall};
  }
`

MenuOption.defaultProps = {
  href: "#",
  role: "button",
}

const CloseButton = styled(FadedButton)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${gapSizes.small};
`
