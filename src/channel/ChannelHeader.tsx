import React from "react"
import { roomSidebarBreakpoint } from "../chat/constants"
import HeaderMenuButton from "../chat/HeaderMenuButton"
import useMedia from "../dom/hooks/useMedia"
import FadedButton from "../ui/components/FadedButton"
import Icon from "../ui/components/Icon"
import {
  flexColumn,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"

type Props = {
  title: string
  onShowChannelMenu: () => void
  onShowDescription: () => void
}

function ChannelHeader(props: Props) {
  // TODO: the parent component should be the one to determine this,
  // not this component
  // we should make onShowChannelMenu nullable,
  // then show the menu button if we receive it
  const isChannelMenuHidden = useMedia(
    `(max-width: ${roomSidebarBreakpoint}px)`,
  )

  return (
    <Container>
      <HeaderMenuButton />

      <MiddleSection>
        <TitleText>{props.title}</TitleText>
        <FadedButton onClick={props.onShowDescription}>
          <span>Description</span>
          <Icon name="about" size={0.8} />
        </FadedButton>
      </MiddleSection>

      {isChannelMenuHidden && (
        <FadedButton onClick={props.onShowChannelMenu}>
          <Icon name="more" />
        </FadedButton>
      )}
    </Container>
  )
}

export default ChannelHeader

const Container = styled.div`
  background-color: ${getThemeColor("theme0")};

  ${flexRow};
  align-items: center;

  padding: ${spacing.small};
  ${spacedChildrenHorizontal(spacing.small)};
`

const MiddleSection = styled.div`
  flex: 1;
  ${flexColumn};
  ${spacedChildrenVertical(spacing.xxsmall)};
`

const TitleText = styled.h3`
  flex: 1;
`
