import { transparentize } from "polished"
import React from "react"
import pick from "../common/helpers/pick"
import FadedButton from "../ui/components/FadedButton"
import Icon from "../ui/components/Icon"
import LoadingIcon from "../ui/components/LoadingIcon"
import {
  fadedRevealStyle,
  flexCenter,
  flexRow,
  spacedChildrenHorizontal,
} from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"

type Props = {
  icon: React.ReactNode
  title: React.ReactNode
  isActive: boolean
  isUnread: boolean
  isLoading?: boolean
  onClick: () => void
  onClose: () => void
}

export default function RoomTab(props: Props) {
  const rightAction = (() => {
    if (!props.onClose) return null

    if (props.isLoading) {
      return (
        <LoadingIconContainer>
          <LoadingIcon />
        </LoadingIconContainer>
      )
    }

    return (
      <CloseButton onClick={props.onClose}>
        <Icon name="close" size={0.7} />
      </CloseButton>
    )
  })()

  return (
    <Container {...pick(props, "isActive", "isUnread", "isLoading")}>
      <TitleButton {...pick(props, "isActive", "onClick")}>
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
  isActive: boolean
  isUnread: boolean
  isLoading?: boolean
}

const Container = styled.div<ContainerProps>`
  ${flexRow};
  align-items: center;

  ${({ isLoading }) => isLoading && { opacity: 0.5, pointerEvents: "none" }}

  background-color: ${({ isActive, isUnread, theme }) => {
    if (isActive) return theme.colors.theme0
    if (isUnread) return transparentize(0.9, theme.colors.success)
    return "transparent"
  }};
`

const TitleButton = styled.button<{ isActive: boolean }>`
  ${(props) => (props.isActive ? "" : fadedRevealStyle)};
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
