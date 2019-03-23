import { shade } from "polished"
import { primaryColor } from "./colors"
import { styled } from "./styled"

const Button = styled.button`
  padding: 0.4rem 0.7rem;
  background-color: ${primaryColor};
  transition: 0.2s;
  transition-property: background-color, transform;

  :hover,
  :focus {
    background-color: ${shade(0.2, primaryColor)};
    outline: none;
  }

  :active {
    transition-duration: 0s;
    transform: translateY(3px);
  }
`

Button.defaultProps = {
  type: "button",
}

export default Button
