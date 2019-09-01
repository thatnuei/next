import { transparentize } from "polished"
import React from "react"
import pick from "../common/pick"
import FadedButton from "../ui/FadedButton"
import {
  fadedRevealStyle,
  flexCenter,
  flexRow,
  spacedChildrenHorizontal,
} from "../ui/helpers"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"

type Props = {
  icon?: React.ReactNode
  title?: React.ReactNode
  active?: boolean
  unread?: boolean
  onClick?: () => void
  onClose?: () => void
}

export default function RoomTab(props: Props) {
  return (
    <Container {...pick(props, "active", "unread")}>
      <TitleButton {...pick(props, "active", "onClick")}>
        <TitleAndIconContainer>
          {props.icon}
          <TitleText>{props.title}</TitleText>
        </TitleAndIconContainer>
      </TitleButton>

      {props.onClose && (
        <CloseButton onClick={props.onClose}>
          <Icon icon="close" size={0.7} />
        </CloseButton>
      )}
    </Container>
  )
}

const Container = styled.div<{ active?: boolean; unread?: boolean }>`
  ${flexRow};

  background-color: ${({ active, unread, theme }) => {
    if (active) return theme.colors.theme0
    if (unread) return transparentize(0.9, theme.colors.success)
    return "transparent"
  }};
`

const TitleButton = styled.button<{ active?: boolean }>`
  ${(props) => (props.active ? "" : fadedRevealStyle)};
  flex: 1;
`

const TitleAndIconContainer = styled.div`
  ${flexRow};
  align-items: center;
  padding: ${spacing.xsmall};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`

const TitleText = styled.div`
  flex: 1;
`

const CloseButton = styled(FadedButton)`
  ${flexCenter};
  padding: ${spacing.xsmall};
`
