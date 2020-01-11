import React from "react"
import useRootStore from "../../useRootStore"
import ExternalLink from "../dom/components/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { semiBlack } from "../ui/colors"
import Box from "../ui/components/Box"
import { useContextMenuContext } from "../ui/components/ContextMenu"
import Icon from "../ui/components/Icon"
import { css, styled } from "../ui/styled"
import { spacing } from "../ui/theme"

type CharacterMenuProps = {
  characterName: string
}

const CharacterMenu = (props: CharacterMenuProps) => {
  const root = useRootStore()
  const menu = useContextMenuContext()

  const profileUrl = getProfileUrl(props.characterName)

  const handleMessage = () => {
    root.privateChatStore.openChat(props.characterName)
  }

  return (
    <Container onClick={menu.close}>
      <Box pad={spacing.small}>
        {/* <CharacterInfo name={props.characterName} /> */}
      </Box>

      <OptionsContainer>
        <OptionLink href={profileUrl}>
          <Icon name="user" />
          <span>Profile</span>
        </OptionLink>

        <OptionButton onClick={handleMessage}>
          <Icon name="message" />
          <span>Message</span>
        </OptionButton>

        <OptionButton>
          <Icon name="bookmark" />
          <span>Bookmark</span>
        </OptionButton>

        <OptionButton>
          <Icon name="ignore" />
          <span>Ignore</span>
        </OptionButton>

        <OptionButton>
          <Icon name="report" />
          <span>Report</span>
        </OptionButton>
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

const optionStyle = css`
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

const OptionButton = styled.button`
  ${optionStyle}
`

const OptionLink = styled(ExternalLink)`
  ${optionStyle}
`

OptionLink.defaultProps = {
  href: "#",
  role: "button",
}
