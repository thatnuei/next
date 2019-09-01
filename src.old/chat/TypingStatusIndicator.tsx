import React from "react"
import { flexRow, spacedChildrenHorizontal } from "../ui/helpers"
import Icon from "../ui/Icon"
import { keyframes, styled } from "../ui/styled"
import { easing, spacing } from "../ui/theme"
import { TypingStatus } from "./types"

type Props = { name: string; status: TypingStatus }

function TypingStatusIndicator(props: Props) {
  const statusText =
    props.status === "paused"
      ? `${props.name} typed something`
      : `${props.name} is typing...`

  return (
    <Container visible={props.status !== "clear"}>
      <span>{statusText}</span>
      <AnimatedIcon
        icon="pencil"
        size={0.8}
        shouldAnimate={props.status === "typing"}
      />
    </Container>
  )
}

export default TypingStatusIndicator

const Container = styled.div<{ visible?: boolean }>`
  ${flexRow};
  align-items: center;
  line-height: 1;
  ${spacedChildrenHorizontal(spacing.xxsmall)};
  height: 20px;
  pointer-events: none;

  transition: 0.2s;
  opacity: ${(props) => (props.visible ? 0.7 : 0)};
  transform: translateY(${(props) => (props.visible ? "0" : "-6px")});
`

const fall = keyframes`
  from {
    transform: translateY(-2px);
  }
  to {
    transform: translateY(2px);
  }
`

const AnimatedIcon = styled(Icon)<{ shouldAnimate?: boolean }>`
  transition: 0.2s transform;
  animation: 0.35s ${easing.easeInSine} infinite alternate-reverse;
  animation-name: ${(props) => (props.shouldAnimate ? fall : "none")};
`
