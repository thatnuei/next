import { pressEffect } from "./helpers"
import { styled } from "./styled"
import { spacing } from "./theme"

const Button = styled.button`
  padding: ${spacing.xsmall} ${spacing.small};
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.2s;
  transition-property: background-color, transform;

  :hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  :disabled {
    pointer-events: none;
  }

  ${pressEffect};
`

Button.defaultProps = {
  type: "button",
}

export default Button
