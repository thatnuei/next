import React from "react"
import SidebarMenuButton from "../chat/components/SidebarMenuButton"
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
import { userListBreakpoint } from "./constants"

type Props = {
  title: string
  onShowChannelMenu: () => void
  onShowDescription: () => void
}

function ChannelHeader(props: Props) {
  const isChannelMenuHidden = useMedia(`(max-width: ${userListBreakpoint}px)`)

  return (
    <Container>
      <SidebarMenuButton />

      <MiddleSection>
        <TitleText>{props.title}</TitleText>
        <FadedButton onClick={props.onShowDescription}>
          <span>Description</span>
          <Icon icon="about" size={0.8} />
        </FadedButton>
      </MiddleSection>

      {isChannelMenuHidden && (
        <FadedButton onClick={props.onShowChannelMenu}>
          <Icon icon="more" />
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
