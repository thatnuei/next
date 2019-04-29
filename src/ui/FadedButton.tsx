import { css, styled } from "./styled"

const fadedRevealStyle = css`
  opacity: 0.4;
  transition: 0.2s opacity;
  :hover,
  :focus {
    opacity: 0.7;
    outline: none;
  }
`

const FadedButton = styled.button`
  cursor: pointer;
  ${fadedRevealStyle};
`
export default FadedButton
