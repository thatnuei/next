import { css, styled } from "./theme"

const fadedRevealStyle = css`
  opacity: 0.4;
  transition: 0.2s opacity;
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const FadedButton = styled.button`
  cursor: pointer;
  ${fadedRevealStyle};
`
export default FadedButton
