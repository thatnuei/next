import { styled } from "./styled"
import { gapSizes } from "./theme"

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

  /* press effect */
  :active {
    transform: translateY(2px);
    transition: none;
  }
`

Button.defaultProps = {
  type: "button",
}

export default Button
