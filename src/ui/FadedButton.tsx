import { fadedRevealStyle, pressEffect } from "./helpers"
import { styled } from "./styled"

const FadedButton = styled.button`
  ${fadedRevealStyle};
  ${pressEffect};
`

FadedButton.defaultProps = {
  type: "button",
}

export default FadedButton
