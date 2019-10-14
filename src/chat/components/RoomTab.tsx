import { transparentize } from "polished"
import React from "react"
import pick from "../../common/helpers/pick"
import FadedButton from "../../ui/components/FadedButton"
import Icon from "../../ui/components/Icon"
import LoadingIcon from "../../ui/components/LoadingIcon"
import {
  fadedRevealStyle,
  flexCenter,
  flexRow,
  spacedChildrenHorizontal,
} from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"

type Props = {
  icon: React.ReactNode
  title: React.ReactNode
  active: boolean
  unread: boolean
  loading?: boolean
  onClick: () => void
  onClose: () => void
}

export default function RoomTab(props: Props) {
  const rightAction = (() => {
    if (!props.onClose) return null

    if (props.loading) {
      return (
        <LoadingIconContainer>
          <LoadingIcon />
        </LoadingIconContainer>
      )
    }

    return (
      <CloseButton onClick={props.onClose}>
        <Icon icon="close" size={0.7} />
      </CloseButton>
    )
  })()

  return (
    <Container {...pick(props, "active", "unread", "loading")}>
      <TitleButton {...pick(props, "active", "onClick")}>
        <TitleAndIconContainer>
          <IconContainer>{props.icon}</IconContainer>
          <TitleText>{props.title}</TitleText>
        </TitleAndIconContainer>
      </TitleButton>
      {rightAction}
    </Container>
  )
}

type ContainerProps = {
  active: boolean
  unread: boolean
  loading?: boolean
}

const Container = styled.div<ContainerProps>`
  ${flexRow};
  align-items: center;

  ${({ loading }) => loading && { opacity: 0.5, pointerEvents: "none" }}

  background-color: ${({ active, unread, theme }) => {
    if (active) return theme.colors.theme0
    if (unread) return transparentize(0.9, theme.colors.success)
    return "transparent"
  }};
`

const TitleButton = styled.button<{ active: boolean }>`
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

const LoadingIconContainer = styled.div`
  margin: ${spacing.xsmall};
`

const IconContainer = styled.div`
  width: 24px;
  ${flexCenter};
`
