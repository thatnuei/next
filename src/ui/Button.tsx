import { css, styled } from "./styled"
import { gapSizes } from "./theme"

export const pressEffect = css`
  :active {
    transform: translateY(2px);
    transition: none;
  }
`

const Button = styled.button`
  padding: ${gapSizes.xsmall} ${gapSizes.small};
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.2s;
  transition-property: background-color, transform;
  cursor: pointer;

  :focus {
    background-color: rgba(0, 0, 0, 0.55);
    outline: none;
  }

  :hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  ${pressEffect};
`

Button.defaultProps = {
  type: "button",
}

export default Button
