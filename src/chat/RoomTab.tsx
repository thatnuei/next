import React from "react"
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
  onClick?: () => void
  onClose?: () => void
}

export default function RoomTab({ onClick = () => {}, ...props }: Props) {
  return (
    <Container active={props.active}>
      <TitleButton active={props.active} onClick={onClick}>
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

const Container = styled.div<{ active?: boolean }>`
  ${flexRow};

  background-color: ${(props) =>
    props.active ? props.theme.colors.theme0 : "transparent"};
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
