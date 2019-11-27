import {
  fadedRevealStyle,
  flexRow,
  pressEffect,
  spacedChildrenHorizontal,
} from "../helpers"
import { styled } from "../styled"
import { spacing } from "../theme"

const FadedButton = styled.button`
  ${fadedRevealStyle};
  ${pressEffect};

  ${flexRow};
  align-items: center;

  ${spacedChildrenHorizontal(spacing.xxsmall)};
`

FadedButton.defaultProps = {
  type: "button",
}

export default FadedButton
