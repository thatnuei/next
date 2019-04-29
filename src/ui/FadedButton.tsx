import { pressEffect } from "./Button"
import { css, styled } from "./styled"

const fadedRevealStyle = css`
  transition: 0.2s;
  opacity: 0.4;

  :hover,
  :focus {
    opacity: 0.7;
    outline: none;
  }
`

const FadedButton = styled.button`
  cursor: pointer;
  ${fadedRevealStyle};
  ${pressEffect};
`
export default FadedButton
