import React from "react"
import ExternalLink from "../../dom/components/ExternalLink"
import { getProfileUrl } from "../../flist/helpers"
import { semiBlack } from "../../ui/colors"
import Box from "../../ui/components/Box"
import { useContextMenuContext } from "../../ui/components/ContextMenu"
import Icon from "../../ui/components/Icon"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import CharacterInfo from "./CharacterInfo"

type CharacterMenuProps = {
  characterName: string
}

const CharacterMenu = (props: CharacterMenuProps) => {
  // const { chatNavigationStore } = useRootStore()
  const menu = useContextMenuContext()

  const profileUrl = getProfileUrl(props.characterName)

  const handleMessage = () => {
    // chatNavigationStore.showTab({
    //   type: "privateChat",
    //   partnerName: props.characterName,
    // })
  }

  return (
    <Container onClick={menu.close}>
      <Box pad={spacing.small}>
        <CharacterInfo name={props.characterName} />
      </Box>

      <OptionsContainer>
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
      </OptionsContainer>
    </Container>
  )
}

export default CharacterMenu

const Container = styled.div`
  position: relative;
`

const OptionsContainer = styled.div`
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
    margin-left: ${spacing.xsmall};
  }
`

MenuOption.defaultProps = {
  href: "#",
  role: "button",
}
