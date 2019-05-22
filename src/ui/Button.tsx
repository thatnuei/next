import { pressEffect } from "./helpers"
import { styled } from "./styled"
import { gapSizes } from "./theme"

const Button = styled.button`
  padding: ${gapSizes.xsmall} ${gapSizes.small};
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.2s;
  transition-property: background-color, transform;

  :hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  ${pressEffect};
`

Button.defaultProps = {
  type: "button",
}

export default Button
